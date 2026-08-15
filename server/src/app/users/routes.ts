import { Router } from "express";
import { container } from "tsyringe";
import { authenticate, requireRole } from "../../common/middlewares/protect.js";
import { Role } from "../../generated/prisma/enums.js";
import { TOKENS } from "../../lib/di/tokens.js";
import { UsersController } from "./controller/users.controller.js";

export const usersRouter = Router();
const ctrl = container.resolve<UsersController>(TOKENS.UsersController);

usersRouter.get("/", authenticate, requireRole(Role.ADMIN), ctrl.list);
usersRouter.patch(
  "/:id/role",
  authenticate,
  requireRole(Role.ADMIN),
  ctrl.updateRole,
);
usersRouter.delete("/:id", authenticate, requireRole(Role.ADMIN), ctrl.remove);
