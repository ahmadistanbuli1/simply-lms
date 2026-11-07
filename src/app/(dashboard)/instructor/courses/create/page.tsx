"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCourseSchema,
  CreateCourseInput,
} from "@/features/courses/validations/course.schema";
import { useCreateCourse } from "@/features/courses/hooks/useCreateCourse";
import { CREATE_COURSE_INPUTS } from "@/data/courses.data";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ErrorMessage";

const CreateCoursePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCourseInput>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { mutate: createCourse, isPending } = useCreateCourse();

  const onSubmit = (data: CreateCourseInput) => {
    createCourse(data);
  };

  const renderInputs = CREATE_COURSE_INPUTS.map((input) => (
    <div key={input.id} className="flex flex-col gap-2 mb-4">
      <Label htmlFor={input.id}>{input.label}</Label>
      <Input
        id={input.id}
        type={input.type}
        placeholder={input.placeholder}
        disabled={isPending}
        {...register(input.name)}
      />
      {errors[input.name] && <ErrorMessage msg={errors[input.name]?.message} />}
    </div>
  ));

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-sm border mt-10">
      <h1 className="text-2xl font-bold mb-2">Create Your Course</h1>
      <p className="text-sm text-gray-500 mb-6">
        You Can Rename The Details Later
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        {renderInputs}

        <div className="flex items-center gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => window.history.back()}
          >
            Close
          </Button>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Loading..." : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCoursePage;
