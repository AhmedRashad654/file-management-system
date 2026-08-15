import { Role } from "../../generated/prisma/enums.js";

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
  createdAt: Date;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedUsers {
  users: SafeUser[];
  pagination: PaginationMeta;
}
