import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CreateCourseInput } from "../validations/course.schema";
import { Course } from "../interfaces/course.interface";
import { courseService } from "../services/course.service";
import { getErrorMessage } from "@/lib/get-error-message";
import { toast } from "sonner";

export const useCreateCourse = () => {
  const router = useRouter();

  return useMutation<Course, unknown, CreateCourseInput>({
    mutationFn: courseService.create,
    onSuccess: (course) => {
      toast.success("Course created successfully");
      router.push(`/instructor/courses/${encodeURIComponent(course.id)}`);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
