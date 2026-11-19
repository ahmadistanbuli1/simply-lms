import { axiosInstance } from "@/lib/axios";
import { Chapter } from "@/features/chapters/interfaces/chapter.interface";
import { UpdateChapterInput } from "../validations/chapter.schema";
import {
  ReorderChaptersInput,
  CreateChapterInput,
} from "@/features/chapters/validations/chapter.schema";
export const chapterService = {
  getById: async (courseId: string, chapterId: string): Promise<Chapter> => {
    const { data } = await axiosInstance.get<Chapter>(
      `/courses/${courseId}/chapters/${chapterId}`,
    );
    return data;
  },

  createChapter: async (
    courseId: string,
    payload: CreateChapterInput,
  ): Promise<Chapter> => {
    const { data } = await axiosInstance.post<Chapter>(
      `/courses/${encodeURIComponent(courseId)}/chapters`,
      payload,
    );
    return data;
  },

  update: async (
    courseId: string,
    chapterId: string,
    payload: UpdateChapterInput,
  ): Promise<Chapter> => {
    const { data } = await axiosInstance.patch<Chapter>(
      `/courses/${courseId}/chapters/${chapterId}`,
      payload,
    );
    return data;
  },

  reorderChapters: async (
    courseId: string,
    payload: ReorderChaptersInput,
  ): Promise<{ message: string }> => {
    const { data } = await axiosInstance.put<{ message: string }>(
      `/courses/${encodeURIComponent(courseId)}/chapters/reorder`,
      payload,
    );
    return data;
  },

  publich: async (courseId: string, chapterId: string): Promise<Chapter> => {
    const { data } = await axiosInstance.patch<Chapter>(
      `/courses/${courseId}/chapters/${chapterId}/publish`,
    );
    return data;
  },
  unpublich: async (courseId: string, chapterId: string): Promise<Chapter> => {
    const { data } = await axiosInstance.patch<Chapter>(
      `/courses/${courseId}/chapters/${chapterId}/unpublish`,
    );
    return data;
  },
};
