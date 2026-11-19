import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getInstructorOrThrow,
  getOwnedCourseOrThrow,
  handleAuthError,
} from "@/lib/auth-helper";

interface RouteParams {
  params: Promise<{ courseId: string; chapterId: string }>;
}

export const PATCH = async (req: Request, { params }: RouteParams) => {
  try {
    const user = await getInstructorOrThrow();

    const { courseId, chapterId } = await params;

    await getOwnedCourseOrThrow(courseId, user.id);

    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId, courseId },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    if (!chapter.title || !chapter.description || !chapter.videoUrl) {
      return NextResponse.json(
        {
          error:
            "Missing required fields. Title, description, and video are required to publish.",
        },
        { status: 400 },
      );
    }

    const publishedChapter = await prisma.chapter.update({
      where: { id: chapterId, courseId: courseId },
      data: { isPublished: true },
    });

    return NextResponse.json(publishedChapter, { status: 200 });
  } catch (error) {
    console.error("[CHAPTER_PUBLISH_ERROR]", error);
    return handleAuthError(error);
  }
};
