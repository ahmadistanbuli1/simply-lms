export interface Chapter {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  position: number;
  isPublished: boolean;
  isFree?: boolean;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}
