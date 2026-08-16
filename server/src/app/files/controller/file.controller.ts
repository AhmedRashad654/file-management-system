import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { FILES_MESSAGES } from "../../../common/constants/messages.constants.js";
import { sendSuccess } from "../../../common/http/response.js";
import { validate } from "../../../common/validation/validate.js";
import { TOKENS } from "../../../lib/di/tokens.js";
import { FileParamsDTO, ListAllFilesQueryDTO, ListFilesQueryDTO } from "../dto/file.dto.js";
import { FileService } from "../service/file.service.js";

@injectable()
export class FileController {
  constructor(
    @inject(TOKENS.FileService) private readonly fileService: FileService,
  ) {}

  get = async (req: Request, res: Response) => {
    const params = validate(FileParamsDTO, req.params);
    const file = await this.fileService.get(req.userId!, params.id);
    sendSuccess(res, file, FILES_MESSAGES.FETCHED);
  };

  upload = async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[] | undefined;
    const parentId = req.body.parentId as string | undefined;
    const result = await this.fileService.upload(
      req.userId!,
      files ?? [],
      parentId,
    );
    sendSuccess(res, result, FILES_MESSAGES.UPLOADED, 201);
  };

  list = async (req: Request, res: Response) => {
    const query = validate(ListFilesQueryDTO, req.query);
    const { folders, files, pagination } = await this.fileService.list(
      req.userId!,
      query,
    );
    sendSuccess(res, { folders, files }, FILES_MESSAGES.LISTED, 200, pagination);
  };

  remove = async (req: Request, res: Response) => {
    const params = validate(FileParamsDTO, req.params);
    await this.fileService.remove(req.userId!, params.id);
    sendSuccess(res, undefined, FILES_MESSAGES.DELETED);
  };

  listAll = async (req: Request, res: Response) => {
    const query = validate(ListAllFilesQueryDTO, req.query);
    const { files, pagination } = await this.fileService.listAll(query);
    sendSuccess(res, files, FILES_MESSAGES.ALL_LISTED, 200, pagination);
  };

  removeAny = async (req: Request, res: Response) => {
    const params = validate(FileParamsDTO, req.params);
    await this.fileService.removeAny(params.id);
    sendSuccess(res, undefined, FILES_MESSAGES.ADMIN_DELETED);
  };
}
