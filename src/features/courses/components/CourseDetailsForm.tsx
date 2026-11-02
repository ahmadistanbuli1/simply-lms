"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  courseDetailsSchema,
  CourseDetailsInput,
} from "../validations/course.schema";
import { useUpdateCourse } from "../hooks/useUpdateCourse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ErrorMessage from "@/components/ErrorMessage";

interface CourseDetailsFormProps {
  initialData: {
    title: string;
    description: string | null;
  };
  courseId: string;
}

export function CourseDetailsForm({
  initialData,
  courseId,
}: CourseDetailsFormProps) {
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
      // If Cancel is pressed, the field is restored to its original saved value
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
    <div className="mt-6 border border-border bg-card text-card-foreground rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <span>Course Details</span>
        <Button
          type="button"
          onClick={handleToggleEdit}
          variant="ghost"
          size="sm"
          disabled={isPending}
        >
          {isEditing
            ? "Cancel"
            : description
              ? "Edit description"
              : "Add description"}
        </Button>
      </div>

      {!isEditing && (
        <>
          <span className="font-bold text-black">{title}</span>
          <p
            className={`text-sm mt-2 ${
              !description ? "text-slate-500 italic" : "text-slate-700"
            }`}
          >
            {description || "No description provided yet."}
          </p>
        </>
      )}

      {isEditing && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="flex flex-col gap-2">
            <Input {...register("title")} />
            {errors.title?.message && (
              <ErrorMessage msg={errors.title.message} />
            )}
            <textarea
              {...register("description")}
              disabled={isPending}
              rows={4}
              className="w-full p-2.5 text-sm border rounded-md bg-card focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50"
              placeholder="e.g. 'This course covers building scalable full-stack applications...'"
            />
            {errors.description?.message && (
              <ErrorMessage msg={errors.description.message} />
            )}
          </div>

          <div className="flex items-center gap-x-2">
            <Button disabled={isPending} type="submit" size="sm">
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
