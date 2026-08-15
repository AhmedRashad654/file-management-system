import express, { NextFunction, Request, Response } from "express";
import { routes } from "./routes.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import { AppError } from "./common/errors/AppError.js";
import { errorHandler } from "./common/middlewares/errorHandler.js";

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api/v1", routes);
  app.use((req: Request, _res: Response, next: NextFunction) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
  app.use(errorHandler);
  return app;
}
