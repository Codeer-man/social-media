import z from "zod";

export const updatePostSchema = z.object({
  mediaUrl: z.string().optional(),
  caption: z.string().optional(),
  visibility: z.enum(["public", "private", "followers"]).optional(),
});
