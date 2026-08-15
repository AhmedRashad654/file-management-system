import { z } from "zod";

export const RegisterDTO = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number"),
});

export const LoginDTO = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required"),
});

export const VerifyEmailDTO = z.object({
  email: z.email(),
  code: z.string().regex(/^\d{6}$/, "Verification code must be 6 digits"),
});

export const ResendCodeDTO = z.object({
  email: z.email(),
});

export type RegisterDTO = z.infer<typeof RegisterDTO>;
export type LoginDTO = z.infer<typeof LoginDTO>;
export type VerifyEmailDTO = z.infer<typeof VerifyEmailDTO>;
export type ResendCodeDTO = z.infer<typeof ResendCodeDTO>;
