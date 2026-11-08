import { useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService } from "../services/course.service";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/get-error-message";
import { Course } from "../interfaces/course.interface";

export const usePublishCourse = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Course, unknown, { isPublished: boolean }>({
    mutationFn: ({ isPublished }) =>
      isPublished
        ? courseService.unpublish(courseId)
        : courseService.publish(courseId),

    onSuccess: (data) => {
      toast.success(
        data.isPublished ? "Course published" : "Course unpublished",
      );
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    },

    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
