import { inject, injectable } from "tsyringe";
import type { Prisma, PrismaClient } from "../../../generated/prisma/client.js";
import { Logger } from "../../../common/logger/logger.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../../lib/cloudinary.js";
import { TOKENS } from "../../../lib/di/tokens.js";
import {
  FileType,
  ListAllFilesQueryDTO,
  ListFilesQueryDTO,
} from "../dto/file.dto.js";
import { extractContent } from "../extract.js";
import {
  FileNotFoundError,
  FileUploadFailedError,
  NoFilesUploadedError,
  ParentFolderNotFoundError,
} from "../errors.js";
import type {
  FileResult,
  ListAllFilesResult,
  ListFilesResult,
} from "../types.js";

const CLOUDINARY_FOLDER = "file-management-system";

const MIME_TYPE_MATCHERS: Record<Exclude<FileType, "other">, string[]> = {
  image: ["image/"],
  pdf: ["application/pdf"],
  doc: [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  text: ["text/"],
  video: ["video/"],
  audio: ["audio/"],
};

const fileSelect = {
  id: true,
  name: true,
  url: true,
  size: true,
  mimeType: true,
  folderId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.FileSelect;

function buildMimeTypeFilter(type: FileType): Prisma.FileWhereInput {
  if (type === "other") {
    const not = Object.values(MIME_TYPE_MATCHERS)
      .flat()
      .map((needle) => ({
        mimeType: { contains: needle, mode: "insensitive" as const },
      }));
    return { NOT: not };
  }

  const or = MIME_TYPE_MATCHERS[type].map((needle) => ({
    mimeType: { contains: needle, mode: "insensitive" as const },
  }));
  return { OR: or };
}

@injectable()
export class FileService {
  constructor(
    @inject(TOKENS.PrismaClient) private readonly prisma: PrismaClient,
    @inject(TOKENS.Logger) private readonly logger: Logger,
  ) {}

  upload = async (
    userId: string,
    files: Express.Multer.File[],
    parentId?: string | null,
  ): Promise<FileResult[]> => {
    if (!files || files.length === 0) {
      throw NoFilesUploadedError;
    }

    const folderId = parentId || null;

    if (folderId) {
      const parent = await this.prisma.folder.findFirst({
        where: { id: folderId, userId },
        select: { id: true },
      });
      if (!parent) {
        throw ParentFolderNotFoundError;
      }
    }

    const uploadedAssets: { publicId: string; mimeType: string }[] = [];
    const records: FileResult[] = [];

    try {
      for (const file of files) {
        const uploaded = await uploadToCloudinary(file.buffer, {
          resource_type: "auto",
          folder: `${CLOUDINARY_FOLDER}/${userId}`,
        });
        uploadedAssets.push({
          publicId: uploaded.public_id,
          mimeType: file.mimetype,
        });

        const extractedContent = await extractContent(
          file.mimetype,
          file.buffer,
          this.logger,
        );

        const record = await this.prisma.file.create({
          data: {
            name: file.originalname,
            url: uploaded.secure_url || uploaded.url,
            publicId: uploaded.public_id,
            size: file.size,
            mimeType: file.mimetype,
            folderId,
            userId,
            extractedContent,
          },
          select: fileSelect,
        });
        records.push(record);
      }

      return records;
    } catch (error) {
      this.logger.error("File upload failed", {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });
      await Promise.allSettled(
        uploadedAssets.map((asset) =>
          deleteFromCloudinary(asset.publicId, asset.mimeType),
        ),
      );
      throw FileUploadFailedError;
    }
  };

  list = async (
    userId: string,
    query: ListFilesQueryDTO,
  ): Promise<ListFilesResult> => {
    const { folderId, page, limit, search, sort, order, type } = query;

    const folderWhere: Prisma.FolderWhereInput = {
      userId,
      parentId: folderId ?? null,
    };

    const fileWhere: Prisma.FileWhereInput = {
      userId,
      folderId: folderId ?? null,
      ...(search
        ? { name: { contains: search, mode: "insensitive" as const } }
        : {}),
      ...(type ? buildMimeTypeFilter(type) : {}),
    };

    const orderBy = { [sort]: order } as Prisma.FileOrderByWithRelationInput;

    const [folders, total, files] = await this.prisma.$transaction([
      this.prisma.folder.findMany({
        where: folderWhere,
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          parentId: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.file.count({ where: fileWhere }),
      this.prisma.file.findMany({
        where: fileWhere,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: fileSelect,
      }),
    ]);

    return {
      folders,
      files,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  };

  remove = async (userId: string, fileId: string): Promise<void> => {
    const file = await this.prisma.file.findFirst({
      where: { id: fileId, userId },
      select: { id: true, publicId: true, mimeType: true },
    });
    if (!file) {
      throw FileNotFoundError;
    }

    await this.deleteFileRecord(file, fileId);
  };

  listAll = async (
    query: ListAllFilesQueryDTO,
  ): Promise<ListAllFilesResult> => {
    const { page, limit, search, sort, order, type } = query;

    const where: Prisma.FileWhereInput = {
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              {
                user: {
                  email: { contains: search, mode: "insensitive" as const },
                },
              },
            ],
          }
        : {}),
      ...(type ? buildMimeTypeFilter(type) : {}),
    };

    const orderBy = { [sort]: order } as Prisma.FileOrderByWithRelationInput;

    const [total, files] = await this.prisma.$transaction([
      this.prisma.file.count({ where }),
      this.prisma.file.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          ...fileSelect,
          userId: true,
          user: { select: { name: true, email: true } },
          folder: { select: { name: true } },
        },
      }),
    ]);

    return {
      files,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  };

  removeAny = async (fileId: string): Promise<void> => {
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
      select: { id: true, publicId: true, mimeType: true },
    });
    if (!file) {
      throw FileNotFoundError;
    }

    await this.deleteFileRecord(file, fileId);
  };

  private async deleteFileRecord(
    file: { publicId: string | null; mimeType: string },
    fileId: string,
  ) {
    if (file.publicId) {
      try {
        await deleteFromCloudinary(file.publicId, file.mimeType);
      } catch (error) {
        this.logger.warn("Failed to delete file from cloudinary", {
          fileId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    await this.prisma.file.delete({ where: { id: fileId } });
  }
}
