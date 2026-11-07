import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateChapterInput } from "../validations/course.schema";
import { Chapter } from "../interfaces/course.interface";
import { courseService } from "../services/course.service";
import { getErrorMessage } from "@/lib/get-error-message";
import { toast } from "sonner";

export const useCreateChapter = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Chapter, unknown, CreateChapterInput>({
    mutationFn: (payload) => courseService.createChapter(courseId, payload),
    onSuccess: () => {
      toast.success("Chapter created successfully");
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
