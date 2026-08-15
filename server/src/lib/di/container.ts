import { container } from "tsyringe";
import { TOKENS } from "./tokens";
import { Logger } from "../../common/logger/logger";
import { prisma } from "../db/prisma";

// Lib/infra/
container.registerSingleton<Logger>(TOKENS.Logger, Logger);
container.registerInstance(TOKENS.PrismaClient, prisma);
