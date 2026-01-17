import z from "zod";

export const createProfileSchema = z.object({
  name: z.string().min(3).max(20),
  userName: z.string().min(3).max(20),
  bio: z.string().max(150).optional(),
  phoneNo: z.string().length(10).optional(),
  location: z.string().optional(),
  website: z.string().url().optional(),
  profilePicture: z.string().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(3).max(20).optional(),
  userName: z.string().min(3).max(20).optional(),
  bio: z.string().max(150).optional(),
  phoneNo: z.string().length(10).optional(),
  location: z.string().optional(),
  website: z.string().url().optional(),
  profilePicture: z.string().optional(),
  accoutnType: z.enum(["public", "private"]).optional(),
});
