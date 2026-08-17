import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/\d/, "Must contain at least one number"),
});

export const verifyEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().regex(/^\d{6}$/, "Verification code must be 6 digits"),
});

export const resendCodeSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const createFolderSchema = z.object({
  name: z.string().trim().min(1, "Folder name is required").max(255),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type VerifyEmailValues = z.infer<typeof verifyEmailSchema>;
export type ResendCodeValues = z.infer<typeof resendCodeSchema>;
export type CreateFolderValues = z.infer<typeof createFolderSchema>;
