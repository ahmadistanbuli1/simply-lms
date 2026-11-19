import { Chapter } from "@/features/chapters/interfaces/chapter.interface";

// The form of the Course that comes from the database
export interface Course {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  isPublished: boolean;
  instructorId: string;
  chapters: Chapter[];
  createdAt: string;
  updatedAt: string;
}

// Successful server response form
export interface CreateCourseResponse {
  course: Course;
  message?: string;
}

export interface StudentCourseCardItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
  instructor: {
    name: string | null;
  };
  _count: {
    chapters: number;
  };
}
