import type { NextFunction, Request, Response } from "express";
import type { Role } from "../../generated/prisma/enums.js";
import { verifyAccessToken } from "../../app/auth/utils.js";
import { NotAuthenticatedError } from "../../app/auth/errors.js";
import { AppError } from "../errors/AppError.js";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      role?: Role;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(NotAuthenticatedError);
  }

  const token = header.slice("Bearer ".length);
  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.userId;
    req.role = payload.role;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.role || !roles.includes(req.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403),
      );
    }
    next();
  };
}
