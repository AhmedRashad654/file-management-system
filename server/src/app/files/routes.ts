import { Router } from "express";
import { container } from "tsyringe";
import { authenticate, requireRole } from "../../common/middlewares/protect.js";
import { Role } from "../../generated/prisma/enums.js";
import { TOKENS } from "../../lib/di/tokens.js";
import { FileController } from "./controller/file.controller.js";
import { FolderController } from "./controller/folder.controller.js";
import { uploadFiles } from "./upload.js";

export const foldersRouter = Router();
const folderCtrl = container.resolve<FolderController>(TOKENS.FolderController);

foldersRouter.post("/", authenticate, folderCtrl.create);
foldersRouter.delete("/:id", authenticate, folderCtrl.remove);

export const filesRouter = Router();
const fileCtrl = container.resolve<FileController>(TOKENS.FileController);

filesRouter.get("/", authenticate, fileCtrl.list);
filesRouter.get("/:id", authenticate, fileCtrl.get);

filesRouter.post(
  "/upload",
  authenticate,
  uploadFiles("files"),
  fileCtrl.upload,
);
filesRouter.delete("/:id", authenticate, fileCtrl.remove);

filesRouter.get(
  "/admin/all",
  authenticate,
  requireRole(Role.ADMIN),
  fileCtrl.listAll,
);
filesRouter.delete(
  "/admin/:id",
  authenticate,
  requireRole(Role.ADMIN),
  fileCtrl.removeAny,
);
