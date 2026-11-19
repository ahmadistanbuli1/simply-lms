import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { cache } from "react";
import { NextResponse } from "next/server";
import { HttpError } from "./http-error";

// Fetch User
export const getCurrentDbUser = cache(async () => {
  const { userId: clerkId } = await auth();

  if (!clerkId) return null;

  return await prisma.user.findUnique({
    where: { clerkId: clerkId },
  });
});

// Check If The User Is Instructor Or No
export const getInstructorOrThrow = async () => {
  const user = await getCurrentDbUser();

  if (!user) throw new HttpError(401, "Unauthorized: Please sign in.");

  if (user.role !== "INSTRUCTOR")
    throw new HttpError(403, "Forbidden: Instructor access required.");

  return user;
};

// Check If Course Belong To Instructor
export const getOwnedCourseOrThrow = async (
  courseId: string,
  userId: string,
) => {
  const course = await prisma.course.findUnique({
    where: { id: courseId, instructorId: userId },
  });
  if (!course) throw new HttpError(404, "Course not found or access denied");
  return course;
};

// Handle Errors
export const handleAuthError = (error: unknown, tag: string) => {
  if (error instanceof HttpError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status },
    );
  }
  console.error(`[${tag}]`, error);
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
};
