import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateChapterInput } from "@/features/chapters/validations/chapter.schema";
import { Chapter } from "@/features/chapters/interfaces/chapter.interface";
import { chapterService } from "@/features/chapters/services/chapter.service";
import { getErrorMessage } from "@/lib/get-error-message";
import { toast } from "sonner";

export const useCreateChapter = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Chapter, unknown, CreateChapterInput>({
    mutationFn: (payload) => chapterService.createChapter(courseId, payload),
    onSuccess: () => {
      toast.success("Chapter created successfully");
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
