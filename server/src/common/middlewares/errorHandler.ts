import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import { container } from "tsyringe";
import { TOKENS } from "../../lib/di/tokens.js";
import { Logger } from "../logger/logger.js";

const logger = container.resolve<Logger>(TOKENS.Logger);

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const operational = err.isOperational;
  const statusCode = err.statusCode || 500;

  if (statusCode >= 500) {
    logger.error(err.message, {
      statusCode,
      stack: err.stack,
      path: req.path,
    });
  }

  if (statusCode === 400) {
    console.log("400 error:", err.stack);
    logger.warn(err.message, {
      statusCode,
      path: req.path,
    });
  }

  if (operational) {
    return res.status(statusCode).json({
      success: false,
      error: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    error: "Something went wrong on our end",
  });
}
