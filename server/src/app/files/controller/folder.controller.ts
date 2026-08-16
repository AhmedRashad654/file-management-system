import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { FOLDERS_MESSAGES } from "../../../common/constants/messages.constants.js";
import { sendSuccess } from "../../../common/http/response.js";
import { validate } from "../../../common/validation/validate.js";
import { TOKENS } from "../../../lib/di/tokens.js";
import {
  CreateFolderDTO,
  FolderParamsDTO,
} from "../dto/folder.dto.js";
import { FolderService } from "../service/folder.service.js";

@injectable()
export class FolderController {
  constructor(
    @inject(TOKENS.FolderService) private readonly folderService: FolderService,
  ) {}

  create = async (req: Request, res: Response) => {
    const body = validate(CreateFolderDTO, req.body);
    const folder = await this.folderService.create(req.userId!, body);
    sendSuccess(res, folder, FOLDERS_MESSAGES.CREATED, 201);
  };

  remove = async (req: Request, res: Response) => {
    const params = validate(FolderParamsDTO, req.params);
    await this.folderService.remove(req.userId!, params.id);
    sendSuccess(res, undefined, FOLDERS_MESSAGES.DELETED);
  };
}
