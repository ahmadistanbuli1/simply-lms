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

export const createChapterSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Chapter title must be at least 3 characters." })
    .max(100, { message: "Chapter title cannot exceed 100 characters." }),
});

export type CreateChapterInput = z.infer<typeof createChapterSchema>;

export const reorderChaptersSchema = z.object({
  list: z
    .array(
      z.object({
        id: z.string().min(1, { message: "Chapter ID is required." }),
        position: z
          .number()
          .int()
          .min(1, { message: "Position must be at least 1." }),
      }),
    )
    .min(1, { message: "Reorder list cannot be empty." }),
});

export type ReorderChaptersInput = z.infer<typeof reorderChaptersSchema>;