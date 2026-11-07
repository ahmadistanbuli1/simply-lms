"use client";

import { useState, useRef } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";

interface FileUploadProps {
  endpoint: "courseImage" | "courseAttachment" | "chapterVideo";
  onChange: (url?: string) => void;
}

export const FileUpload = ({ endpoint, onChange }: FileUploadProps) => {
  const [progress, setProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onUploadBegin: () => {
      setProgress(0);
    },
    onUploadProgress: (p) => {
      setProgress(p);
    },
    onClientUploadComplete: (res) => {
      setProgress(100);
      const uploadedUrl = res?.[0]?.ufsUrl;
      onChange(uploadedUrl);
    },
    onUploadError: (error: Error) => {
      setProgress(0);
      toast.error(error.message || "Failed to upload file.");
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    await startUpload(Array.from(selectedFiles));
  };

  const handleOpenFileDialog = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      onClick={handleOpenFileDialog}
      className={`relative flex flex-col items-center justify-center w-full h-56 rounded-xl border-2 border-dashed transition-all px-6 text-center ${
        isUploading
          ? "border-primary/50 bg-primary/5 cursor-wait"
          : "border-border bg-muted/20 hover:bg-muted/40 hover:border-primary/50 cursor-pointer"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={endpoint === "courseImage" ? "image/*" : undefined}
        onChange={handleFileChange}
        disabled={isUploading}
        className="hidden"
      />

      {isUploading ? (
        <div className="w-full max-w-xs flex flex-col items-center justify-center space-y-3">
          <div className="flex items-center gap-2 text-primasry font-semibold text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Uploading image... {progress}%</span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden border border-border">
            <div
              className="h-full bg-primary transition-all duration-200 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="text-[11px] text-muted-foreground">
            Please wait while we process your file
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UploadCloud className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              Click to select an image
            </p>
            <p className="text-xs text-muted-foreground">
              Recommended aspect ratio 16:9 (Max 4MB)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
