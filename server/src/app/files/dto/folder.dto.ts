import { z } from "zod";

export const CreateFolderDTO = z.object({
  name: z.string().trim().min(1, "Folder name is required").max(255),
  parentId: z
    .string()
    .uuid("Invalid parent folder id")
    .optional()
    .nullable(),
});

export const FolderParamsDTO = z.object({
  id: z.string().uuid("Invalid folder id"),
});

export type CreateFolderDTO = z.infer<typeof CreateFolderDTO>;
export type FolderParamsDTO = z.infer<typeof FolderParamsDTO>;
