import { z } from "zod";

export const conversionStatusSchema = z.enum([
  "validating",
  "extracting",
  "converting",
  "ready",
  "error"
]);

export type ConversionStatus = z.infer<typeof conversionStatusSchema>;

export const conversionJobSchema = z.object({
  id: z.string(),
  youtubeUrl: z.string().url(),
  status: conversionStatusSchema,
  progress: z.number().min(0).max(100),
  videoTitle: z.string().optional(),
  videoDuration: z.string().optional(),
  fileSize: z.string().optional(),
  fileName: z.string().optional(),
  downloadPath: z.string().optional(),
  error: z.string().optional(),
});

export type ConversionJob = z.infer<typeof conversionJobSchema>;

export const insertConversionJobSchema = z.object({
  youtubeUrl: z.string().url(),
});

export type InsertConversionJob = z.infer<typeof insertConversionJobSchema>;

export const youtubeUrlSchema = z.string().refine(
  (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[\w-]+/;
    return youtubeRegex.test(url);
  },
  { message: "Please enter a valid YouTube URL" }
);
