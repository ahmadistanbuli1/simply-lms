import {
  getInstructorOrThrow,
  getOwnedCourseOrThrow,
  handleAuthError,
} from "@/lib/auth-helper";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface IRouteParams {
  params: Promise<{ courseId: string }>;
}

export const PATCH = async (req: Request, { params }: IRouteParams) => {
  try {
    const user = await getInstructorOrThrow();

    const { courseId } = await params;

    const course = await getOwnedCourseOrThrow(courseId, user.id);

    if (!course?.title || !course.description || !course.imageUrl)
      return NextResponse.json({ error: "All Data Required" }, { status: 400 });

    const publishCourse = await prisma.course.update({
      where: {
        id: courseId,
        instructorId: user.id,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishCourse, { status: 200 });
  } catch (error) {
    console.error(`The Error In Route ${error}`);
    return handleAuthError(error);
  }
};
