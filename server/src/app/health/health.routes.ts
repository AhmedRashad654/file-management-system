import { Router } from "express";
import { prisma } from "../../lib/db/prisma.js";

export const healthRouter = Router();

healthRouter.get("/", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.status(200).send("OK");
});
