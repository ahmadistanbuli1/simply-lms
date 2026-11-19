import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleAuthError } from "@/lib/auth-helper";

export const GET = async () => {
  try {
    const publishedCourses = await prisma.course.findMany({
      where: {
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        createdAt: true,
        instructor: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(publishedCourses, { status: 200 });
  } catch (error) {
    return handleAuthError(error, "Internal Server Error");
  }
};
