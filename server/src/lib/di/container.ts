import { container } from "tsyringe";
import { TOKENS } from "./tokens.js";
import { Logger } from "../../common/logger/logger.js";
import { prisma } from "../db/prisma.js";
import { MailjetEmailProvider } from "../email/mailjet.js";
import { AuthService } from "../../app/auth/service/auth.service.js";
import { AuthController } from "../../app/auth/controller/auth.controller.js";
import { UsersService } from "../../app/users/service/users.service.js";
import { UsersController } from "../../app/users/controller/users.controller.js";
import { FolderService } from "../../app/files/service/folder.service.js";
import { FileService } from "../../app/files/service/file.service.js";
import { FolderController } from "../../app/files/controller/folder.controller.js";
import { FileController } from "../../app/files/controller/file.controller.js";
import { StatisticsService } from "../../app/statistics/service/statistics.service.js";
import { StatisticsController } from "../../app/statistics/controller/statistics.controller.js";

// Lib/infra/
container.registerSingleton<Logger>(TOKENS.Logger, Logger);
container.registerInstance(TOKENS.PrismaClient, prisma);
container.registerSingleton<MailjetEmailProvider>(TOKENS.EmailProvider, MailjetEmailProvider);

// Services
container.registerSingleton<AuthService>(TOKENS.AuthService, AuthService);
container.registerSingleton<UsersService>(TOKENS.UsersService, UsersService);
container.registerSingleton<FolderService>(TOKENS.FolderService, FolderService);
container.registerSingleton<FileService>(TOKENS.FileService, FileService);
container.registerSingleton<StatisticsService>(TOKENS.StatisticsService, StatisticsService);

// Controllers
container.registerSingleton<AuthController>(TOKENS.AuthController, AuthController);
container.registerSingleton<UsersController>(TOKENS.UsersController, UsersController);
container.registerSingleton<FolderController>(TOKENS.FolderController, FolderController);
container.registerSingleton<FileController>(TOKENS.FileController, FileController);
container.registerSingleton<StatisticsController>(TOKENS.StatisticsController, StatisticsController);
