"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, Pencil, PlusCircle, X, Loader2 } from "lucide-react";
import { useUpdateCourse } from "../hooks/useUpdateCourse";
import { FileUpload } from "@/components/shared/FileUpload";
import { Button } from "@/components/ui/button";

interface CourseImageFormProps {
  initialData: {
    imageUrl: string | null;
  };
  courseId: string;
}

export const CourseImageForm = ({
  initialData,
  courseId,
}: CourseImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isImageRendering, setIsImageRendering] = useState(true);
  const { mutate: updateCourse, isPending } = useUpdateCourse(courseId);

  const handleToggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const handleImageUploaded = (url?: string) => {
    if (!url) return;

    setIsImageRendering(true);
    updateCourse(
      { imageUrl: url },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  return (
    <div className="rounded-xl border border-border bg-card text-card-foreground p-5 shadow-xs transition-all">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
          <ImageIcon className="w-4 h-4 text-primary" />
          <span>Course Thumbnail</span>
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

          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add an image</span>
            </>
          )}

          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="w-3.5 h-3.5" />
              <span>Change image</span>
            </>
          )}
        </Button>
      </div>

      {/* (View Mode) */}
      {!isEditing && (
        <div className="pt-4">
          {!initialData.imageUrl ? (
            <div className="flex flex-col items-center justify-center h-56 rounded-xl border border-dashed border-border bg-muted/20 text-muted-foreground">
              <ImageIcon className="h-10 w-10 mb-2 opacity-60" />
              <span className="text-xs">No cover image uploaded yet</span>
            </div>
          ) : (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted/30">
              {/* onLoad Cursor */}
              {isImageRendering && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted/60 backdrop-blur-xs">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}

              <Image
                alt="Course cover"
                fill
                src={initialData.imageUrl}
                onLoad={() => setIsImageRendering(false)}
                className={`object-cover transition-opacity duration-500 ${
                  isImageRendering ? "opacity-0" : "opacity-100"
                }`}
              />
            </div>
          )}
        </div>
      )}

      {/* (Upload Mode) */}
      {isEditing && (
        <div className="pt-4 space-y-3">
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => handleImageUploaded(url)}
          />
          <p className="text-xs text-muted-foreground text-center">
            16:9 aspect ratio recommended for optimal display across devices.
          </p>
        </div>
      )}
    </div>
  );
};
