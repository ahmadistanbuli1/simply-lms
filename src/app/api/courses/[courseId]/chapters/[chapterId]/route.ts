import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/auth-helper";
import { updateChapterSchema } from "@/features/chapters/validations/chapter.schema";

interface RouteParams {
  params: Promise<{ courseId: string; chapterId: string }>;
}

export const GET = async (_req: Request, { params }: RouteParams) => {
  try {
    const user = await getCurrentDbUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { courseId, chapterId } = await params;

    // IDOR : The chapter must belong to the course, and the course must be owned by this instructor.
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      },
    });

    if (!chapter)
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });

    const courseOwner = await prisma.course.findUnique({
      where: { id: courseId, instructorId: user.id },
    });

    if (!courseOwner)
      return NextResponse.json({ error: "Access denied" }, { status: 403 });

    return NextResponse.json(chapter, { status: 200 });
  } catch (error) {
    console.error("[CHAPTER_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};

export const PATCH = async (req: Request, { params }: RouteParams) => {
  try {
    const user = await getCurrentDbUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { courseId, chapterId } = await params;
    const body = await req.json();

    const validationResult = updateChapterSchema.safeParse(body);
    if (!validationResult.success) {
      const errorMessage =
        validationResult.error.issues[0]?.message ?? "Invalid data";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const courseOwner = await prisma.course.findUnique({
      where: { id: courseId, instructorId: user.id },
    });

    if (!courseOwner)
      return NextResponse.json({ error: "Access denied" }, { status: 403 });

    const updatedChapter = await prisma.chapter.update({
      where: { id: chapterId, courseId },
      data: validationResult.data,
    });

    return NextResponse.json(updatedChapter, { status: 200 });
  } catch (error) {
    console.error("[CHAPTER_PATCH_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
