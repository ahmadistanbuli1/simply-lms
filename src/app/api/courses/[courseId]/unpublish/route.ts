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

    await getOwnedCourseOrThrow(courseId, user.id);

    const unpublishCourse = await prisma.course.update({
      where: {
        id: courseId,
        instructorId: user.id,
      },
      data: {
        isPublished: false,
      },
    });

    return NextResponse.json(unpublishCourse, { status: 201 });
  } catch (error) {
    console.log(`The Error In Route ${error}`);
    return handleAuthError(error);
  }
};
