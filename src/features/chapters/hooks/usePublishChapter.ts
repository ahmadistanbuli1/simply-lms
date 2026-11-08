import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chapterService } from "../services/chapter.service";
import { getErrorMessage } from "@/lib/get-error-message";
import { toast } from "sonner";
import { Chapter } from "@/features/courses/interfaces/course.interface";

export const usePublishChapter = (courseId: string, chapterId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Chapter, unknown, { isPublished: boolean }>({
    mutationFn: ({ isPublished }) =>
      isPublished
        ? chapterService.unpublich(courseId, chapterId)
        : chapterService.publich(courseId, chapterId),

    onSuccess: (data) => {
      toast.success(
        data.isPublished ? "Chapter published" : "Chapter unpublished",
      );
      queryClient.invalidateQueries({ queryKey: ["chapter", chapterId] });
      queryClient.invalidateQueries({ queryKey: ["course", courseId] }); // لتحديث حالة الفصل في قائمة الدورة
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
