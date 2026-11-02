import { useQuery } from "@tanstack/react-query";
import { Course } from "../interfaces/course.interface";
import { courseService } from "../services/course.service";

export function useGetCourse(courseId: string) {
  return useQuery<Course, unknown>({
    queryKey: ["course", courseId],
    queryFn: () => courseService.getById(courseId),
    enabled: Boolean(courseId),
  });
}
