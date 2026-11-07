import { axiosInstance } from "@/lib/axios";
import { Chapter } from "@/features/courses/interfaces/course.interface";
import { UpdateChapterInput } from "../validations/chapter.schema";

export const chapterService = {
  getById: async (courseId: string, chapterId: string): Promise<Chapter> => {
    const { data } = await axiosInstance.get<Chapter>(
      `/courses/${courseId}/chapters/${chapterId}`,
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
};
