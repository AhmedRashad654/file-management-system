import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { USERS_MESSAGES } from "../../../common/constants/messages.constants.js";
import { sendSuccess } from "../../../common/http/response.js";
import { validate } from "../../../common/validation/validate.js";
import { TOKENS } from "../../../lib/di/tokens.js";
import {
  UpdateUserRoleDTO,
  UserParamsDTO,
  ViewUsersQueryDTO,
} from "../dto/users.dto.js";
import { UsersService } from "../service/users.service.js";

@injectable()
export class UsersController {
  constructor(
    @inject(TOKENS.UsersService) private readonly usersService: UsersService,
  ) {}

  list = async (req: Request, res: Response) => {
    const query = validate(ViewUsersQueryDTO, req.query);
    const { users, pagination } = await this.usersService.list(query);
    sendSuccess(res, users, USERS_MESSAGES.LISTED, 200, pagination);
  };

  updateRole = async (req: Request, res: Response) => {
    const params = validate(UserParamsDTO, req.params);
    const body = validate(UpdateUserRoleDTO, req.body);
    const result = await this.usersService.updateRole(
      req.userId!,
      params.id,
      body.role,
    );
    sendSuccess(res, result, USERS_MESSAGES.ROLE_UPDATED);
  };

  remove = async (req: Request, res: Response) => {
    const params = validate(UserParamsDTO, req.params);
    await this.usersService.remove(req.userId!, params.id);
    sendSuccess(res, undefined, USERS_MESSAGES.DELETED);
  };
}
