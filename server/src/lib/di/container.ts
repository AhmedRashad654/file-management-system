import { container } from "tsyringe";
import { TOKENS } from "./tokens";
import { Logger } from "../../common/logger/logger";
import { prisma } from "../db/prisma";
import { MailjetEmailProvider } from "../email/mailjet";
import { AuthService } from "../../app/auth/service/auth.service";
import { AuthController } from "../../app/auth/controller/auth.controller";
import { UsersService } from "../../app/users/service/users.service";
import { UsersController } from "../../app/users/controller/users.controller";
import { FolderService } from "../../app/files/service/folder.service";
import { FileService } from "../../app/files/service/file.service";
import { FolderController } from "../../app/files/controller/folder.controller";
import { FileController } from "../../app/files/controller/file.controller";
import { StatisticsService } from "../../app/statistics/service/statistics.service";
import { StatisticsController } from "../../app/statistics/controller/statistics.controller";

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
