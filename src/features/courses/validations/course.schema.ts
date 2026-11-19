import { z } from "zod";

export const courseDetailsSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters." })
    .max(100, { message: "Title cannot exceed 100 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(1000, { message: "Description cannot exceed 1000 characters." }),
});

export type CourseDetailsInput = z.infer<typeof courseDetailsSchema>;

export const createCourseSchema = courseDetailsSchema;
export type CreateCourseInput = CourseDetailsInput;

export const updateCourseSchema = z.object({
  title: courseDetailsSchema.shape.title.optional(),
  description: courseDetailsSchema.shape.description.optional(),
  imageUrl: z.string().url({ message: "Invalid image URL." }).optional(),
  isPublished: z.boolean().optional(),
});

export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
