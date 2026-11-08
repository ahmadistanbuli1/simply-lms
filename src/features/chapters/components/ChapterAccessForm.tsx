"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, X, Check } from "lucide-react";
import {
  updateChapterSchema,
  UpdateChapterInput,
} from "../validations/chapter.schema";
import { useUpdateChapter } from "../hooks/useUpdateChapter";
import { Button } from "@/components/ui/button";

interface ChapterAccessFormProps {
  initialData: {
    isFree: boolean;
  };
  courseId: string;
  chapterId: string;
}

export const ChapterAccessForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterAccessFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateChapter, isPending } = useUpdateChapter(
    courseId,
    chapterId,
  );

  const { handleSubmit, control, reset } = useForm<UpdateChapterInput>({
    resolver: zodResolver(updateChapterSchema),
    defaultValues: {
      isFree: !!initialData.isFree,
    },
    values: {
      isFree: !!initialData.isFree,
    },
  });

  const handleToggleEdit = () => {
    if (isEditing) reset();
    setIsEditing((prev) => !prev);
  };

  const onSubmit = (values: UpdateChapterInput) => {
    updateChapter(values, {
      onSuccess: () => setIsEditing(false),
    });
  };

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b">
        <span className="font-semibold text-sm">Chapter Access</span>
        <Button
          onClick={handleToggleEdit}
          variant="ghost"
          size="sm"
          disabled={isPending}
        >
          {isEditing ? (
            <>
              <X className="w-3.5 h-3.5 mr-1" /> Cancel
            </>
          ) : (
            <>
              <Pencil className="w-3.5 h-3.5 mr-1" /> Edit access
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="pt-4 text-sm">
          {initialData.isFree ? (
            <p className="text-emerald-600 font-medium">
              This chapter is free for preview.
            </p>
          ) : (
            <p className="text-muted-foreground">This chapter is not free.</p>
          )}
        </div>
      )}

      {isEditing && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <Controller
            name="isFree"
            control={control}
            render={({ field }) => (
              <div className="flex items-center space-x-3 border rounded-md p-4">
                <input
                  type="checkbox"
                  id="isFree"
                  checked={field.value}
                  onChange={field.onChange}
                  disabled={isPending}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <label
                  htmlFor="isFree"
                  className="text-sm font-medium leading-none"
                >
                  Check this box if you want to make this chapter free for
                  preview.
                </label>
              </div>
            )}
          />

          <div className="flex justify-end">
            <Button disabled={isPending} type="submit" size="sm">
              <Check className="w-4 h-4 mr-1" /> Save
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
