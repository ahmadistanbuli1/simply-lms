import { useQuery } from "@tanstack/react-query";
import { StudentCourseCardItem } from "../interfaces/course.interface";
import { courseService } from "../services/course.service";

export const useGetPublishedCourses = () => {
  return useQuery<StudentCourseCardItem[], unknown>({
    queryKey: ["student-published-courses"],
    queryFn: () => courseService.getPublishedCourses(),
  });
};
