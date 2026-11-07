"use client";

import Link from "next/link";
import { ArrowLeft, LayoutDashboard, Eye, Video } from "lucide-react";
import { useGetChapter } from "../hooks/useGetChapter";
import { ChapterDetailsForm } from "../components/ChapterDetailsForm";
import { ChapterAccessForm } from "./ChapterAccessForm";
import { ChapterVideoForm } from "./ChapterVideoForm";

interface ChapterSetupContentProps {
  courseId: string;
  chapterId: string;
}

export const ChapterSetupContent = ({
  courseId,
  chapterId,
}: ChapterSetupContentProps) => {
  const {
    data: chapter,
    isLoading,
    isError,
  } = useGetChapter(courseId, chapterId);

  if (isLoading) {
    return (
      <div className="p-6 text-center text-muted-foreground animate-pulse">
        Loading chapter details...
      </div>
    );
  }

  if (isError || !chapter) {
    return (
      <div className="p-6 text-center text-destructive">
        Failed to load chapter.
      </div>
    );
  }

  const requiredFields = [chapter.title, chapter.description];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Link
        href={`/instructor/courses/${courseId}`}
        className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to course setup
      </Link>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Chapter Setup</h1>
          <p className="text-sm text-muted-foreground">
            Complete all fields {completionText}
          </p>
        </div>
        {/* (Publish Chapter) */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Customize your chapter</h2>
          </div>

          <ChapterDetailsForm
            initialData={{
              title: chapter.title,
              description: chapter.description,
              isFree: Boolean(chapter.isFree),
            }}
            courseId={courseId}
            chapterId={chapterId}
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Access Settings</h2>
          </div>

          <ChapterAccessForm
            initialData={{ isFree: Boolean(chapter.isFree) }}
            courseId={courseId}
            chapterId={chapterId}
          />

          <div className="flex items-center gap-2 mt-8">
            <Video className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Add a video</h2>
          </div>

          <div className="p-4 rounded-xl border border-dashed bg-muted/20 text-sm text-muted-foreground text-center">
            <ChapterVideoForm
              initialData={{ videoUrl: chapter.videoUrl }}
              courseId={courseId}
              chapterId={chapterId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
