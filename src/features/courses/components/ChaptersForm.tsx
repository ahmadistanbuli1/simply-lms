"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, BookOpen } from "lucide-react";
import {
  createChapterSchema,
  CreateChapterInput,
} from "../validations/course.schema";
import { Chapter } from "../interfaces/course.interface";
import { useCreateChapter } from "../hooks/useCreateChapter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ErrorMessage from "@/components/ErrorMessage";

interface ChaptersFormProps {
  initialData: {
    chapters: Chapter[];
  };
  courseId: string;
}

export function ChaptersForm({ initialData, courseId }: ChaptersFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const { mutate: createChapter, isPending } = useCreateChapter(courseId);

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

  const chapters = initialData.chapters || [];

  return (
    <div className="mt-6 border border-border bg-card text-card-foreground rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <span>Course Chapters</span>
        <Button
          type="button"
          onClick={handleToggleCreate}
          variant="ghost"
          size="sm"
          disabled={isPending}
          className="gap-1.5"
        >
          {isCreating ? (
            "Cancel"
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              <span>Add a chapter</span>
            </>
          )}
        </Button>
      </div>

      {/* نموذج إضافة فصل جديد */}
      {isCreating && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="flex flex-col gap-2">
            <Input
              {...register("title")}
              disabled={isPending}
              placeholder="e.g. 'Introduction to the course'"
            />
            {errors.title?.message && (
              <ErrorMessage msg={errors.title.message} />
            )}
          </div>
          <Button disabled={isPending} type="submit" size="sm">
            {isPending ? "Creating..." : "Create"}
          </Button>
        </form>
      )}

      {/* عرض قائمة الفصول الحالية */}
      {!isCreating && (
        <div className="mt-4">
          {chapters.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              No chapters added yet.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {chapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className="flex items-center justify-between p-3 rounded-md border border-border bg-muted/40 text-sm"
                >
                  <div className="flex items-center gap-2 font-medium">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span>
                      {chapter.position}. {chapter.title}
                    </span>
                  </div>

                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      chapter.isPublished
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-slate-500/10 text-muted-foreground"
                    }`}
                  >
                    {chapter.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
