import { axiosInstance } from "@/lib/axios";
import { Course, StudentCourseCardItem } from "@/features/courses/interfaces/course.interface";
import {
  CreateCourseInput,
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

  publish: async (courseId: string): Promise<Course> => {
    const { data } = await axiosInstance.patch<Course>(
      `/courses/${encodeURIComponent(courseId)}/publish`,
    );

    return data;
  },

  unpublish: async (courseId: string): Promise<Course> => {
    const { data } = await axiosInstance.patch<Course>(
      `/courses/${encodeURIComponent(courseId)}/unpublish`,
    );

    return data;
  },

  getPublishedCourses: async (): Promise<StudentCourseCardItem[]> => {
    const { data } =
      await axiosInstance.get<StudentCourseCardItem[]>("/student/courses");
    return data;
  },
};
