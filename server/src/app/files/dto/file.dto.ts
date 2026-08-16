import { z } from "zod";

export const FileTypeEnum = z.enum([
  "image",
  "pdf",
  "doc",
  "text",
  "video",
  "audio",
  "other",
]);

export const ListFilesQueryDTO = z.object({
  folderId: z.string().uuid("Invalid folder id").optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().min(1).max(200).optional(),
  sort: z.enum(["name", "createdAt", "size"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  type: FileTypeEnum.optional(),
});

export const ListAllFilesQueryDTO = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().min(1).max(200).optional(),
  sort: z
    .enum(["name", "createdAt", "size"])
    .default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  type: FileTypeEnum.optional(),
});

export const FileParamsDTO = z.object({
  id: z.string().uuid("Invalid file id"),
});

export type FileType = z.infer<typeof FileTypeEnum>;
export type ListFilesQueryDTO = z.infer<typeof ListFilesQueryDTO>;
export type ListAllFilesQueryDTO = z.infer<typeof ListAllFilesQueryDTO>;
export type FileParamsDTO = z.infer<typeof FileParamsDTO>;
