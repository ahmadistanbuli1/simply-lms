import { getCurrentDbUser } from "@/lib/auth-helper";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface IRouteParams {
  params: Promise<{ courseId: string }>;
}

export const PATCH = async (req: Request, { params }: IRouteParams) => {
  try {
    const user = await getCurrentDbUser();

    if (!user) return NextResponse.json({ error: "UnAuthrized", status: 401 });

    const { courseId } = await params;

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) NextResponse.json({ error: "Course Not Found", status: 404 });

    const courseOwner = await prisma.course.findUnique({
      where: {
        id: courseId,
        instructorId: user.id,
      },
    });

    if (!courseOwner) NextResponse.json({ error: "Forbidden", status: 403 });

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
  } catch (error: unknown) {
    console.log(`The Error In Route ${error}`);
    return NextResponse.json({ error: "Invalid Server Error", status: 500 });
  }
};
