import { AppError } from "../common/errors/AppError.js";

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new AppError(`Missing required environment variable: ${name}`, 500);
  }
  return value;
}
