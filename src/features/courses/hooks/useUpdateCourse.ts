import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateCourseInput } from "../validations/course.schema";
import { Course } from "../interfaces/course.interface";
import { courseService } from "../services/course.service";
import { getErrorMessage } from "@/lib/get-error-message";
import { toast } from "sonner";

export function useUpdateCourse(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation<Course, unknown, UpdateCourseInput>({
    mutationFn: (payload) => courseService.update(courseId, payload),
    onSuccess: (updatedCourse) => {
      toast.success("Course updated successfully");
      queryClient.setQueryData(["course", courseId], updatedCourse);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
