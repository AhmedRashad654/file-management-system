import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import { InvalidTokenError } from "./errors.js";
import type { JwtPayloadType } from "./types.js";
import { requireEnv } from "../../utils/requireEnv.js";


export const VERIFICATION_CODE_TTL_MS = 15 * 60 * 1000;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function comparePassword(passwordInput: string, hashedPassword: string) {
  return bcrypt.compare(passwordInput, hashedPassword);
}

export function createAccessToken(payload: JwtPayloadType): string {
  return jwt.sign(payload, requireEnv("JWT_ACCESS_SECRET"), {
    expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || "15m") as StringValue,
  });
}

export function createRefreshToken(payload: JwtPayloadType): string {
  return jwt.sign(payload, requireEnv("JWT_REFRESH_SECRET"), {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as StringValue,
  });
}

export function verifyAccessToken(token: string): JwtPayloadType {
  try {
    return jwt.verify(token, requireEnv("JWT_ACCESS_SECRET")) as JwtPayloadType;
  } catch {
    throw InvalidTokenError;
  }
}

export function verifyRefreshToken(token: string): JwtPayloadType {
  try {
    return jwt.verify(token, requireEnv("JWT_REFRESH_SECRET")) as JwtPayloadType;
  } catch {
    throw InvalidTokenError;
  }
}

export function generateVerificationCode(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export function hashCode(code: string): string {
  return crypto.createHash("sha256").update(code).digest("hex");
}
