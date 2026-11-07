"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, X, Check, FileText } from "lucide-react";
import {
  courseDetailsSchema,
  CourseDetailsInput,
} from "../validations/course.schema";
import { useUpdateCourse } from "../hooks/useUpdateCourse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ErrorMessage from "@/components/ErrorMessage";

interface CourseDetailsFormProps {
  initialData: {
    title: string;
    description: string | null;
  };
  courseId: string;
}

export const CourseDetailsForm = ({
  initialData,
  courseId,
}: CourseDetailsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateCourse, isPending } = useUpdateCourse(courseId);
  const { title, description } = initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseDetailsInput>({
    resolver: zodResolver(courseDetailsSchema),
    defaultValues: {
      title: title ?? "",
      description: description ?? "",
    },
    values: { title: title ?? "", description: description ?? "" },
    resetOptions: { keepDirtyValues: true },
  });

  const handleToggleEdit = () => {
    if (isEditing) {
      reset({ title: title ?? "", description: description ?? "" });
    }
    setIsEditing((prev) => !prev);
  };

  const onSubmit = (values: CourseDetailsInput) => {
    updateCourse(values, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  return (
    <div className="rounded-xl border border-border bg-card text-card-foreground p-5 shadow-xs transition-all">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
          <FileText className="w-4 h-4 text-primary" />
          <span>Course Details</span>
        </div>

        <Button
          type="button"
          onClick={handleToggleEdit}
          variant="ghost"
          size="sm"
          disabled={isPending}
          className="h-8 gap-1.5 text-xs font-medium"
        >
          {isEditing ? (
            <>
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit details</span>
            </>
          )}
        </Button>
      </div>

      {/* (View Mode) */}
      {!isEditing && (
        <div className="space-y-4 pt-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Course Title
            </span>
            <p className="text-base font-semibold text-foreground">{title}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Course Description
            </span>
            <p
              className={`text-sm leading-relaxed ${
                !description
                  ? "text-muted-foreground italic"
                  : "text-foreground/90"
              }`}
            >
              {description || "No description provided yet."}
            </p>
          </div>
        </div>
      )}

      {/* (Edit Mode) */}
      {isEditing && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="course-title" className="text-xs font-semibold">
              Course Title
            </Label>
            <Input
              id="course-title"
              disabled={isPending}
              placeholder="e.g. 'Advanced Next.js Architecture'"
              {...register("title")}
            />
            {errors.title?.message && (
              <ErrorMessage msg={errors.title.message} />
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="course-description"
              className="text-xs font-semibold"
            >
              Course Description
            </Label>
            <textarea
              id="course-description"
              {...register("description")}
              disabled={isPending}
              rows={4}
              className="w-full p-3 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              placeholder="e.g. 'This course covers building scalable full-stack applications...'"
            />
            {errors.description?.message && (
              <ErrorMessage msg={errors.description.message} />
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              disabled={isPending}
              type="submit"
              size="sm"
              className="gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isPending ? "Saving..." : "Save Changes"}</span>
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
