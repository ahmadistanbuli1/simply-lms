"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Loader2, Layers, X } from "lucide-react";
import {
  createChapterSchema,
  CreateChapterInput,
} from "../validations/course.schema";
import { Chapter } from "../interfaces/course.interface";
import { useCreateChapter } from "../hooks/useCreateChapter";
import { useReorderChapters } from "../hooks/useReorderChapters";
import { ChaptersList } from "./ChaptersList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ErrorMessage from "@/components/ErrorMessage";

interface ChaptersFormProps {
  initialData: {
    chapters: Chapter[];
  };
  courseId: string;
}

export const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const { mutate: createChapter, isPending: isCreatingChapter } =
    useCreateChapter(courseId);
  const { mutate: reorderChapters, isPending: isReordering } =
    useReorderChapters(courseId);

  const isBusy = isCreatingChapter || isReordering;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateChapterInput>({
    resolver: zodResolver(createChapterSchema),
    defaultValues: {
      title: "",
    },
  });

  const handleToggleCreate = () => {
    if (isCreating) {
      reset({ title: "" });
    }
    setIsCreating((prev) => !prev);
  };

  const onSubmit = (values: CreateChapterInput) => {
    createChapter(values, {
      onSuccess: () => {
        reset({ title: "" });
        setIsCreating(false);
      },
    });
  };

  const handleReorder = (updateData: { id: string; position: number }[]) => {
    reorderChapters({ list: updateData });
  };

  const handleEditChapter = (chapterId: string) => {
    router.push(`/instructor/courses/${courseId}/chapters/${chapterId}`);
  };

  const chapters = initialData.chapters || [];

  return (
    <div className="relative rounded-xl border border-border bg-card text-card-foreground p-5 shadow-xs">
      {isReordering && (
        <div className="absolute inset-0 bg-background/70 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Saving new order...</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
          <Layers className="w-4 h-4 text-primary" />
          <span>Course Chapters</span>
          <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
            {chapters.length}
          </span>
        </div>

        <Button
          type="button"
          onClick={handleToggleCreate}
          variant="ghost"
          size="sm"
          disabled={isBusy}
          className="h-8 gap-1.5 text-xs font-medium"
        >
          {isCreating ? (
            <>
              <X className="h-3.5 w-3.5" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Add a chapter</span>
            </>
          )}
        </Button>
      </div>

      {/* Create Chapter */}
      {isCreating && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Input
              {...register("title")}
              disabled={isBusy}
              placeholder="e.g. 'Module 1: Introduction & Setup'"
            />
            {errors.title?.message && (
              <ErrorMessage msg={errors.title.message} />
            )}
          </div>
          <div className="flex justify-end">
            <Button disabled={isBusy} type="submit" size="sm">
              {isCreatingChapter ? "Creating..." : "Create Chapter"}
            </Button>
          </div>
        </form>
      )}

      {/* List Of Chapters */}
      {!isCreating && (
        <div className="pt-4">
          {chapters.length === 0 ? (
            <div className="py-8 text-center border border-dashed border-border rounded-lg bg-muted/20">
              <p className="text-sm text-muted-foreground">
                No chapters added yet. Click &ldquo;Add a chapter&rdquo; to
                start.
              </p>
            </div>
          ) : (
            <>
              <ChaptersList
                items={chapters}
                onReorder={handleReorder}
                onEdit={handleEditChapter}
                disabled={isBusy}
              />
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Drag and drop chapters using the handle to reorder your
                curriculum.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};
