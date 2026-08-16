import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { STATISTICS_MESSAGES } from "../../../common/constants/messages.constants.js";
import { sendSuccess } from "../../../common/http/response.js";
import { validate } from "../../../common/validation/validate.js";
import { TOKENS } from "../../../lib/di/tokens.js";
import { UserStatsQueryDTO } from "../dto/statistics.dto.js";
import { StatisticsService } from "../service/statistics.service.js";

@injectable()
export class StatisticsController {
  constructor(
    @inject(TOKENS.StatisticsService)
    private readonly statisticsService: StatisticsService,
  ) {}

  getUserStats = async (req: Request, res: Response) => {
    const query = validate(UserStatsQueryDTO, req.query);
    const stats = await this.statisticsService.getUserStats(
      req.userId!,
      query.period,
    );
    sendSuccess(res, stats, STATISTICS_MESSAGES.USER_FETCHED);
  };

  getAdminStats = async (req: Request, res: Response) => {
    const stats = await this.statisticsService.getAdminStats();
    sendSuccess(res, stats, STATISTICS_MESSAGES.ADMIN_FETCHED);
  };
}
