import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/auth-helper";
import { reorderChaptersSchema } from "@/features/courses/validations/course.schema";

interface RouteParams {
  params: Promise<{ courseId: string }>;
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    // Authentication
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await params;
    const body = await req.json();

    // Zod (Validation)
    const validationResult = reorderChaptersSchema.safeParse(body);
    if (!validationResult.success) {
      const errorMessage =
        validationResult.error.issues[0]?.message ?? "Invalid reorder payload";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { list } = validationResult.data;

    // Authorization
    const courseOwner = await prisma.course.findUnique({
      where: {
        id: courseId,
        instructorId: user.id,
      },
    });

    if (!courseOwner) {
      return NextResponse.json(
        { error: "Course not found or access denied" },
        { status: 404 },
      );
    }

    // IDOR Prevention: Make sure that all submitted chapters actually belong to this course.
    const chapterIds = list.map((item) => item.id);
    const matchingChaptersCount = await prisma.chapter.count({
      where: {
        id: { in: chapterIds },
        courseId: courseId,
      },
    });

    if (matchingChaptersCount !== list.length) {
      return NextResponse.json(
        { error: "One or more chapters do not belong to this course" },
        { status: 403 },
      );
    }

    // Atomic Database Transaction
    await prisma.$transaction(
      list.map((item) =>
        prisma.chapter.update({
          where: { id: item.id, courseId: courseId },
          data: { position: item.position },
        }),
      ),
    );

    return NextResponse.json(
      { message: "Chapters reordered successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("[CHAPTERS_REORDER_PUT_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
