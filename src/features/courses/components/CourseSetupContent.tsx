"use client";

import {
  AlertTriangle,
  CheckCircle2,
  LayoutDashboard,
  ListChecks,
  Sparkles,
} from "lucide-react";
import { useGetCourse } from "../hooks/useGetCourse";
import { CourseDetailsForm } from "./CourseDetailsForm";
import { ChaptersForm } from "./ChaptersForm";
import { CourseImageForm } from "./CourseImageForm";

interface CourseSetupContentProps {
  courseId: string;
}

export const CourseSetupContent = ({ courseId }: CourseSetupContentProps) => {
  const { data: course, isLoading, isError } = useGetCourse(courseId);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-100">
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading course workspace...
        </p>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="p-6 flex items-center justify-center min-h-100">
        <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm font-medium">
          Failed to load course or access denied.
        </div>
      </div>
    );
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    (course.chapters ?? []).length > 0,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const progressPercentage = Math.round((completedFields / totalFields) * 100);
  const isComplete = completedFields === totalFields;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background text-foreground pb-16">
      {/* Top alert bar for the status of the session */}
      {!course.isPublished && (
        <div className="w-full border-b border-amber-500/20 bg-amber-500/10 px-6 py-3">
          <div className="max-w-6xl mx-auto flex items-center gap-2.5 text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-medium">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              This course is currently in <strong>Draft</strong> mode. It will
              not be visible to students until published.
            </span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instructor Studio</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {course.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                Configure your course details, curriculum chapters, and media
                assets.
              </p>
            </div>

            <div className="w-full md:w-72 p-4 rounded-xl border border-border bg-muted/30 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      isComplete ? "text-emerald-500" : "text-primary"
                    }`}
                  />
                  Setup Progress
                </span>
                <span className="text-foreground">
                  {completedFields} of {totalFields} completed (
                  {progressPercentage}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Destails Of Course*/}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground leading-none">
                  Customize your course
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Title, description, and cover thumbnail
                </p>
              </div>
            </div>

            <CourseDetailsForm
              initialData={{
                title: course.title,
                description: course.description,
              }}
              courseId={course.id}
            />
            <CourseImageForm
              initialData={{ imageUrl: course.imageUrl }}
              courseId={course.id}
            />
          </div>

          {/* Chapters Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                <ListChecks className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground leading-none">
                  Course chapters
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Structure and reorder your learning modules
                </p>
              </div>
            </div>

            <ChaptersForm
              initialData={{ chapters: course.chapters }}
              courseId={course.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
