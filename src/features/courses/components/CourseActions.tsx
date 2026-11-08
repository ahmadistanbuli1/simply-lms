"use client";

import { Button } from "@/components/ui/button";
import { usePublishCourse } from "../hooks/usePublishCourse";

interface IProps {
  courseId: string;
  isPublished: boolean;
  disabled: boolean;
}

const CourseActions = ({ courseId, isPublished, disabled }: IProps) => {
  const { mutate: togglePublish, isPending } = usePublishCourse(courseId);

  const onClick = () => togglePublish({ isPublished });
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

export default CourseActions;
