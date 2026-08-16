import { inject, injectable } from "tsyringe";
import type { PrismaClient } from "../../../generated/prisma/client.js";
import { Logger } from "../../../common/logger/logger.js";
import { deleteFromCloudinary } from "../../../lib/cloudinary.js";
import { TOKENS } from "../../../lib/di/tokens.js";
import { CreateFolderDTO } from "../dto/folder.dto.js";
import {
  FolderNameConflictError,
  FolderNotFoundError,
  ParentFolderNotFoundError,
} from "../errors.js";
import type { FolderResult } from "../types.js";

@injectable()
export class FolderService {
  constructor(
    @inject(TOKENS.PrismaClient) private readonly prisma: PrismaClient,
    @inject(TOKENS.Logger) private readonly logger: Logger,
  ) {}

  create = async (
    userId: string,
    data: CreateFolderDTO,
  ): Promise<FolderResult> => {
    const { name, parentId } = data;

    if (parentId) {
      const parent = await this.prisma.folder.findFirst({
        where: { id: parentId, userId },
        select: { id: true },
      });
      if (!parent) {
        throw ParentFolderNotFoundError;
      }
    }

    const existing = await this.prisma.folder.findFirst({
      where: { userId, parentId: parentId ?? null, name },
      select: { id: true },
    });
    if (existing) {
      throw FolderNameConflictError;
    }

    return this.prisma.folder.create({
      data: { name, parentId: parentId ?? null, userId },
    });
  };

  remove = async (userId: string, folderId: string): Promise<void> => {
    const folder = await this.prisma.folder.findFirst({
      where: { id: folderId, userId },
      select: { id: true },
    });
    if (!folder) {
      throw FolderNotFoundError;
    }

    const folderIds = await this.collectDescendantFolderIds(folderId);

    const files = await this.prisma.file.findMany({
      where: { folderId: { in: folderIds } },
      select: { publicId: true, mimeType: true },
    });

    const results = await Promise.allSettled(
      files
        .filter((file) => file.publicId)
        .map((file) => deleteFromCloudinary(file.publicId!, file.mimeType)),
    );

    for (const result of results) {
      if (result.status === "rejected") {
        this.logger.warn("Failed to delete file from cloudinary", {
          folderId,
          error:
            result.reason instanceof Error
              ? result.reason.message
              : String(result.reason),
        });
      }
    }

    await this.prisma.folder.delete({ where: { id: folderId } });
  };

  private async collectDescendantFolderIds(
    folderId: string,
  ): Promise<string[]> {
    const ids: string[] = [folderId];
    let parents: string[] = [folderId];

    while (parents.length > 0) {
      const children = await this.prisma.folder.findMany({
        where: { parentId: { in: parents } },
        select: { id: true },
      });
      parents = children.map((child) => child.id);
      ids.push(...parents);
    }

    return ids;
  }
}
