import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getCurrentDbUser } from "@/lib/auth-helper";

const f = createUploadthing();

const handleAuth = async (): Promise<{ userId: string }> => {
  const user = await getCurrentDbUser();
  if (!user) {
    throw new UploadThingError("Unauthorized: Please sign in to upload files.");
  }
  return { userId: user.id };
};

export const ourFileRouter = {
  // 1. مسار رفع صورة غلاف الدورة
  courseImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => await handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),

  // 2. مسار رفع مرفقات الدروس (جاهز للمراحل القادمة)
  courseAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(async () => await handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),

  // 3. مسار رفع فيديو الدرس (جاهز للمراحل القادمة)
  chapterVideo: f({
    video: { maxFileCount: 1, maxFileSize: "512MB" },
  })
    .middleware(async () => await handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
