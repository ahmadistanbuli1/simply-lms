"use client";

import { useState } from "react";
import { Video, Pencil, PlusCircle, X } from "lucide-react";
import { useUpdateChapter } from "../hooks/useUpdateChapter";
import { FileUpload } from "@/components/shared/FileUpload";
import { Button } from "@/components/ui/button";

interface ChapterVideoFormProps {
  initialData: {
    videoUrl: string | null;
  };
  courseId: string;
  chapterId: string;
}

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateChapter, isPending } = useUpdateChapter(
    courseId,
    chapterId,
  );

  const handleToggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const handleVideoUploaded = (url?: string) => {
    if (!url) return;

    updateChapter(
      { videoUrl: url },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  return (
    <div className="rounded-xl border border-border bg-card text-card-foreground p-5 shadow-xs transition-all mt-6">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
          <Video className="w-4 h-4 text-primary" />
          <span>Chapter Video</span>
        </div>

        <Button
          type="button"
          onClick={handleToggleEdit}
          variant="ghost"
          size="sm"
          disabled={isPending}
          className="h-8 gap-1.5 text-xs font-medium"
        >
          {isEditing && (
            <>
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </>
          )}

          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add a video</span>
            </>
          )}

          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit video</span>
            </>
          )}
        </Button>
      </div>

      {/* (View Mode) */}
      {!isEditing && (
        <div className="pt-4">
          {!initialData.videoUrl ? (
            <div className="flex flex-col items-center justify-center h-60 rounded-xl border border-dashed border-border bg-muted/20 text-muted-foreground">
              <Video className="h-10 w-10 mb-2 opacity-60" />
              <span className="text-xs">No video uploaded yet</span>
            </div>
          ) : (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-black">
              <video
                controls
                controlsList="nodownload" // For Prevent Direct Upload
                className="w-full h-full"
                src={initialData.videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      )}

      {/* (Upload Mode) */}
      {isEditing && (
        <div className="pt-4 space-y-3">
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => handleVideoUploaded(url)}
          />
          <p className="text-xs text-muted-foreground text-center">
            Upload your lesson video here. Maximum file size is 512MB.
          </p>
        </div>
      )}
    </div>
  );
};
