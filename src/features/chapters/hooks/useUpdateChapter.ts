import { Chapter } from "@/features/courses/interfaces/course.interface";
import { chapterService } from "../services/chapter.service";
import { UpdateChapterInput } from "../validations/chapter.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/get-error-message";

export const useUpdateChapter = (courseId: string, chapterId: string) => {
  const queryClient = useQueryClient();
  return useMutation<Chapter, unknown, UpdateChapterInput>({
    mutationFn: (payload) =>
      chapterService.update(courseId, chapterId, payload),

    onSuccess: () => {
      toast.success("Ok, Updated Successfully");
      queryClient.invalidateQueries({ queryKey: ["chapter", chapterId] });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
