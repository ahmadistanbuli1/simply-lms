import { ChapterSetupContent } from "@/features/chapters/components/ChapterSetupContent";

interface PageProps {
  params: Promise<{ courseId: string; chapterId: string }>;
}

const ChapterSetupPage = async ({ params }: PageProps) => {
  const { courseId, chapterId } = await params;

  return <ChapterSetupContent courseId={courseId} chapterId={chapterId} />;
};

export default ChapterSetupPage;
