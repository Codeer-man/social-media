import z from "zod";

export const registerSchema = z
  .object({
    email: z.email().trim(),
    password: z.string().min(6).trim(),
    confirmPassword: z.string().min(6).trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password doesnot match to the confirmPassword",
    path: ["confirmPassword"],
  });

export const loginSchame = z.object({
  email: z.email(),
  password: z.string().min(6),
  twoFactorCode: z.string().optional(),
});
