import { container } from "tsyringe";
import { TOKENS } from "./tokens";
import { Logger } from "../../common/logger/logger";
import { prisma } from "../db/prisma";
import { MailjetEmailProvider } from "../email/mailjet";
import { AuthService } from "../../app/auth/service/auth.service";
import { AuthController } from "../../app/auth/controller/auth.controller";
import { UsersService } from "../../app/users/service/users.service";
import { UsersController } from "../../app/users/controller/users.controller";

// Lib/infra/
container.registerSingleton<Logger>(TOKENS.Logger, Logger);
container.registerInstance(TOKENS.PrismaClient, prisma);
container.registerSingleton<MailjetEmailProvider>(TOKENS.EmailProvider, MailjetEmailProvider);

// Services
container.registerSingleton<AuthService>(TOKENS.AuthService, AuthService);
container.registerSingleton<UsersService>(TOKENS.UsersService, UsersService);

// Controllers
container.registerSingleton<AuthController>(TOKENS.AuthController, AuthController);
container.registerSingleton<UsersController>(TOKENS.UsersController, UsersController);
