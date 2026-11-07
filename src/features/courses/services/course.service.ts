import { axiosInstance } from "@/lib/axios";
import { Chapter, Course } from "../interfaces/course.interface";
import {
  CreateChapterInput,
  CreateCourseInput,
  ReorderChaptersInput,
  UpdateCourseInput,
} from "../validations/course.schema";

export const courseService = {
  create: async (payload: CreateCourseInput): Promise<Course> => {
    const { data } = await axiosInstance.post<Course>("/courses", payload);
    return data;
  },

  getById: async (courseId: string): Promise<Course> => {
    const { data } = await axiosInstance.get<Course>(
      `/courses/${encodeURIComponent(courseId)}`,
    );
    return data;
  },

  update: async (
    courseId: string,
    payload: UpdateCourseInput,
  ): Promise<Course> => {
    const { data } = await axiosInstance.patch<Course>(
      `/courses/${encodeURIComponent(courseId)}`,
      payload,
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
};
