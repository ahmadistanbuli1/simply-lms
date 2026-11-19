import { CourseSetupContent } from "@/features/courses/components/CourseSetupContent";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

const CourseSetupPage = async ({ params }: PageProps) => {
  const { courseId } = await params;
  return <CourseSetupContent courseId={courseId} />;
};

export default CourseSetupPage;
