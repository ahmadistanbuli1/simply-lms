import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCourseSchema } from "@/features/courses/validations/course.schema";
import { getInstructorOrThrow, handleAuthError } from "@/lib/auth-helper";

export async function POST(req: Request) {
  try {
    const user = await getInstructorOrThrow();

    const body = await req.json();

    const validationResult = createCourseSchema.safeParse(body);

    if (!validationResult.success) {
      const errorMessage =
        validationResult.error.issues[0]?.message ?? "Invalid input";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { title, description } = validationResult.data;

    const course = await prisma.course.create({
      data: {
        title: title,
        description: description,
        instructorId: user.id,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("[COURSES_POST_API_ERROR]", error);
    return handleAuthError(error);
  }
}
