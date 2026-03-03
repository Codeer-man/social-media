import z from "zod";

export const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be 6 character long").trim(),
    confirmPassword: z.string().min(6).trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password doesnot match to the confirmPassword",
    path: ["confirmPassword"],
  });

export type registerFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be 6 character long").trim(),
});

export type loginFormData = z.infer<typeof loginSchema>;

export const forgetPwdSchema = z.object({
  email: z.string().email(),
});

export type forgetPwdData = z.infer<typeof forgetPwdSchema>;

export const newPwdSchema = z.object({
  password: z.string().min(6, "Password must be 6 character long").trim(),
});

export type newPwdData = z.infer<typeof newPwdSchema>;
