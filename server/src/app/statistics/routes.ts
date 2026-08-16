import { Router } from "express";
import { container } from "tsyringe";
import {
  authenticate,
  requireRole,
} from "../../common/middlewares/protect.js";
import { Role } from "../../generated/prisma/enums.js";
import { TOKENS } from "../../lib/di/tokens.js";
import { StatisticsController } from "./controller/statistics.controller.js";

export const statisticsRouter = Router();
const ctrl = container.resolve<StatisticsController>(
  TOKENS.StatisticsController,
);

statisticsRouter.get("/me", authenticate, ctrl.getUserStats);
statisticsRouter.get(
  "/admin",
  authenticate,
  requireRole(Role.ADMIN),
  ctrl.getAdminStats,
);
