import { z } from "zod";

export const UserStatsQueryDTO = z.object({
  period: z.coerce.number().int().min(1).max(90).default(30),
});

export type UserStatsQueryDTO = z.infer<typeof UserStatsQueryDTO>;
