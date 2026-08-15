import { z } from "zod";
import { Role } from "../../../generated/prisma/enums.js";

export const ViewUsersQueryDTO = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().min(1).max(100).optional(),
  role: z.nativeEnum(Role).optional(),
});

export const UserParamsDTO = z.object({
  id: z.string().uuid("Invalid user id"),
});

export const UpdateUserRoleDTO = z.object({
  role: z.nativeEnum(Role),
});

export type ViewUsersQueryDTO = z.infer<typeof ViewUsersQueryDTO>;
export type UserParamsDTO = z.infer<typeof UserParamsDTO>;
export type UpdateUserRoleDTO = z.infer<typeof UpdateUserRoleDTO>;
