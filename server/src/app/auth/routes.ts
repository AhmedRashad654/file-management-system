import { Router } from "express";
import { container } from "tsyringe";
import { TOKENS } from "../../lib/di/tokens.js";
import { authenticate } from "../../common/middlewares/protect.js";
import { AuthController } from "./controller/auth.controller.js";
import { resendCodeLimiter } from "../../common/middlewares/rate-limiters.js";

export const authRouter = Router();
const ctrl = container.resolve<AuthController>(TOKENS.AuthController);

authRouter.post("/register", ctrl.register);
authRouter.post("/login", ctrl.login);
authRouter.post("/verify-email", ctrl.verifyEmail);
authRouter.post("/resend-code",resendCodeLimiter, ctrl.resendCode);
authRouter.get("/profile", authenticate, ctrl.profile);
authRouter.post("/refresh", ctrl.refresh);
authRouter.post("/logout", ctrl.logout);
