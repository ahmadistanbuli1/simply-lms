"use client";

import { Button } from "@/components/ui/button";
import { usePublishChapter } from "../hooks/usePublishChapter";

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

export const ChapterActions = ({
  disabled,
  courseId,
  chapterId,
  isPublished,
}: ChapterActionsProps) => {
  const { mutate: togglePublish, isPending } = usePublishChapter(
    courseId,
    chapterId,
  );

  const onClick = () => {
    togglePublish({ isPublished });
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isPending}
        variant={isPublished ? "outline" : "default"}
        size="sm"
      >
        {isPending ? "Loading..." : isPublished ? "Unpublish" : "Publish"}
      </Button>
    </div>
  );
};
