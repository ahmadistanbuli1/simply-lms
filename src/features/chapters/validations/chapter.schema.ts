import { z } from "zod";

export const updateChapterSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters." })
    .max(100, { message: "Title cannot exceed 100 characters." })
    .optional(),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(1000, { message: "Description cannot exceed 1000 characters." })
    .optional(),
  videoUrl: z.string().url({ message: "Invalid video URL." }).optional(),
  isFree: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

export type UpdateChapterInput = z.infer<typeof updateChapterSchema>;
