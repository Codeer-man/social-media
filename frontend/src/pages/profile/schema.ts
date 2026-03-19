import z from "zod";

export const createProfileSchema = z.object({
  name: z.string().min(3).nonempty(),
  userName: z.string().min(3).nonempty(),
  bio: z.string().optional(),
  phoneNo: z.string().optional(),
  location: z.string().optional(),
  avatar: z.string().optional(),
});

export type createProfileSchemaData = z.infer<typeof createProfileSchema>;
