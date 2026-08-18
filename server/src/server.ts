import "dotenv/config";
import "reflect-metadata";
import "./lib/di/container.js";
import { container } from "tsyringe";
import { Logger } from "./common/logger/logger.js";
import { TOKENS } from "./lib/di/tokens.js";
import { createApp } from "./app.js";
import type { Server } from "http";
import { prisma } from "./lib/db/prisma.js";

const app = createApp();
const logger = container.resolve<Logger>(TOKENS.Logger);

const port = process.env.PORT || 8080;

const server: Server = app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});

async function shutdown() {
  logger.info("Shutdown signal received, closing server...");
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
