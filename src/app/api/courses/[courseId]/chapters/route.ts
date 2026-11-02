import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/auth-helper";
import { createChapterSchema } from "@/features/courses/validations/course.schema";

interface RouteParams {
  params: Promise<{ courseId: string }>;
}

export async function POST(req: Request, { params }: RouteParams) {
  try {
    // Identity verification (Authentication)
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await params;
    const body = await req.json();

    // Input validation
    const validationResult = createChapterSchema.safeParse(body);
    if (!validationResult.success) {
      const errorMessage =
        validationResult.error.issues[0]?.message ?? "Invalid chapter data";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Authorization verification: Does this instructor actually own this course?
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

    // Position calculation by retrieving the last chapter in this course
    const lastChapter = await prisma.chapter.findFirst({
      where: { courseId },
      orderBy: { position: "desc" },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    // Creating a chapter in the database
    const chapter = await prisma.chapter.create({
      data: {
        title: validationResult.data.title,
        courseId,
        position: newPosition,
      },
    });

    return NextResponse.json(chapter, { status: 201 });
  } catch (error) {
    console.error("[CHAPTERS_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
