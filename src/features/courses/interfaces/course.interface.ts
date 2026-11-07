export interface Chapter {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  position: number;
  isPublished: boolean;
  isFree?: boolean ;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}

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
