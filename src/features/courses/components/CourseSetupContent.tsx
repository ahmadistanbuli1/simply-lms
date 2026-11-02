"use client";

import { useGetCourse } from "../hooks/useGetCourse";
import { ChaptersForm } from "./ChaptersForm";
import { CourseDetailsForm } from "./CourseDetailsForm";

interface Props {
  courseId: string; // Not Promise
}

export function CourseSetupContent({ courseId }: Props) {
  const { data: course, isLoading, isError } = useGetCourse(courseId);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-100">
        <p className="text-sm text-slate-500 animate-pulse">
          Loading course details...
        </p>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="p-6 flex items-center justify-center min-h-100">
        <p className="text-sm text-red-500 font-medium">
          Failed to load course or access denied.
        </p>
      </div>
    );
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.chapters.length > 0,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">
            Course Setup: {course.title}
          </h1>
          <span className="text-sm text-slate-600">
            Complete all fields to publish your course {completionText}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div>
          <h2 className="text-xl font-medium text-foreground">
            Customize your course
          </h2>

          <CourseDetailsForm
            initialData={{
              title: course.title,
              description: course.description,
            }}
            courseId={course.id}
          />
        </div>

        <div>
          <h2 className="text-xl font-medium text-foreground">
            Course chapters
          </h2>
          <ChaptersForm
            initialData={{ chapters: course.chapters }}
            courseId={course.id}
          />
        </div>
      </div>
    </div>
  );
}
