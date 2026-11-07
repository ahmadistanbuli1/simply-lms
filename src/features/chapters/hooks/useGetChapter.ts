import { useQuery } from "@tanstack/react-query";
import { Chapter } from "@/features/courses/interfaces/course.interface";
import { chapterService } from "../services/chapter.service";

export const useGetChapter = (courseId: string, chapterId: string) => {
  return useQuery<Chapter, unknown>({
    queryKey: ["chapter", chapterId],
    queryFn: () => chapterService.getById(courseId, chapterId),
    enabled: Boolean(courseId && chapterId),
  });
};
