import z from "zod";

export const createStorySchema = z.object({
  mediaKey: z.string(),
  mediaType: z.string(),
  mediaUrl: z.string(),
});
