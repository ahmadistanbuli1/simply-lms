import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateCourseSchema } from "@/features/courses/validations/course.schema";
import { getCurrentDbUser } from "@/lib/auth-helper";

interface RouteParams {
  params: Promise<{ courseId: string }>;
}

export const GET = async (req: Request, { params }: RouteParams) => {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await params;

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        // Protection against IDOR vulnerability: Ensures the user is the course owner.
        instructorId: user.id,
      },
      include: {
        chapters: {
          orderBy: { position: "asc" },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error("[COURSE_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};

export const PATCH = async (req: Request, { params }: RouteParams) => {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await params;
    const body = await req.json();

    const validationResult = updateCourseSchema.safeParse(body);
    if (!validationResult.success) {
      const errorMessage =
        validationResult.error.issues[0]?.message ?? "Invalid data";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // تحديث الدورة بشرط أن يكون المستخدم هو المالك الفعلي لها
    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId, instructorId: user.id },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: "Course not found or access denied" },
        { status: 404 },
      );
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: validationResult.data,
    });

    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (error) {
    console.error("[COURSE_PATCH_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
