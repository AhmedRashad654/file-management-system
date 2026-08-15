import type { Response } from "express";

export function sendSuccess<T, M = undefined>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200,
  meta?: M,
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta !== undefined ? { meta } : {}),
  });
}
