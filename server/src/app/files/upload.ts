import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { AppError } from "../../common/errors/AppError.js";

export const MAX_FILE_SIZE = 25 * 1024 * 1024;
export const MAX_FILES_PER_UPLOAD = 20;

const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES_PER_UPLOAD,
  },
});

export function uploadFiles(fieldName: string, maxFiles = MAX_FILES_PER_UPLOAD) {
  const middleware = uploadMiddleware.array(fieldName, maxFiles);
  return (req: Request, res: Response, next: NextFunction) => {
    middleware(req, res, (err: unknown) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return next(
            new AppError(
              `File too large. Maximum allowed size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
              400,
            ),
          );
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return next(
            new AppError(
              `Too many files. Maximum allowed is ${maxFiles} files`,
              400,
            ),
          );
        }
        return next(new AppError(err.message, 400));
      }
      if (err) {
        const message =
          err instanceof Error ? err.message : "File upload failed";
        return next(new AppError(message, 400));
      }
      next();
    });
  };
}
