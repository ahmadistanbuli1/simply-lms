import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { chapterService } from "../services/chapter.service";
import { getErrorMessage } from "@/lib/get-error-message";
import {
  CreateChapterInput,
  UpdateChapterInput,
} from "@/features/chapters/validations/chapter.schema";
import { Chapter } from "@/features/chapters/interfaces/chapter.interface";
import { ReorderChaptersInput } from "@/features/chapters/validations/chapter.schema";
// نطلب courseId (دائماً مطلوب) و chapterId (اختياري لأنه غير موجود عند الإنشاء)
export const useChapterManager = (courseId: string, chapterId?: string) => {
  const queryClient = useQueryClient();

  // 1. الإنشاء (Create)
  const createMutation = useMutation<Chapter, unknown, CreateChapterInput>({
    mutationFn: (payload) => chapterService.createChapter(courseId, payload),
    onSuccess: () => {
      toast.success("Chapter created successfully");
      // نُبطل الكاش الخاص بالدورة كاملة لجلب الفصل الجديد في القائمة
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  // 2. التحديث (Update)
  const updateMutation = useMutation<Chapter, unknown, UpdateChapterInput>({
    mutationFn: (payload) => {
      if (!chapterId) throw new Error("Chapter ID is required.");
      return chapterService.update(courseId, chapterId, payload);
    },
    onSuccess: () => {
      toast.success("Chapter updated successfully");
      queryClient.invalidateQueries({ queryKey: ["chapter", chapterId] });
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  // 3. النشر / الإلغاء (Publish / Unpublish)
  const publishMutation = useMutation<
    Chapter,
    unknown,
    { isPublished: boolean }
  >({
    mutationFn: ({ isPublished }) => {
      if (!chapterId) throw new Error("Chapter ID is required.");
      return isPublished
        ? chapterService.unpublich(courseId, chapterId)
        : chapterService.publich(courseId, chapterId);
    },
    onSuccess: (data) => {
      toast.success(
        data.isPublished ? "Chapter published" : "Chapter unpublished",
      );
      queryClient.invalidateQueries({ queryKey: ["chapter", chapterId] });
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  // 4. إعادة الترتيب (Reorder)
  const reorderMutation = useMutation<
    { message: string },
    unknown,
    ReorderChaptersInput
  >({
    mutationFn: (payload) => chapterService.reorderChapters(courseId, payload),
    onSuccess: () => {
      toast.success("Chapters order saved");
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
      queryClient.invalidateQueries({ queryKey: ["course", courseId] }); // استعادة الترتيب القديم عند الخطأ
    },
  });

  return {
    createChapter: createMutation.mutate,
    isCreating: createMutation.isPending,

    updateChapter: updateMutation.mutate,
    isUpdating: updateMutation.isPending,

    togglePublish: publishMutation.mutate,
    isPublishing: publishMutation.isPending,

    reorderChapters: reorderMutation.mutate,
    isReordering: reorderMutation.isPending,

    // حالة إشغال عامة
    isBusy:
      createMutation.isPending ||
      updateMutation.isPending ||
      publishMutation.isPending ||
      reorderMutation.isPending,
  };
};
