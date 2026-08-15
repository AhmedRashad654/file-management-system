import { inject, injectable } from "tsyringe";
import {
  Role,
  type Prisma,
  type PrismaClient,
} from "../../../generated/prisma/client.js";
import { TOKENS } from "../../../lib/di/tokens.js";
import { UpdateUserRoleDTO, ViewUsersQueryDTO } from "../dto/users.dto.js";
import {
  CannotDeleteOwnAccountError,
  CannotModifyOwnRoleError,
  CannotRemoveLastAdminError,
  UserNotFoundError,
} from "../errors.js";
import type { PaginatedUsers, SafeUser } from "../types.js";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isVerified: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

@injectable()
export class UsersService {
  constructor(
    @inject(TOKENS.PrismaClient) private readonly prisma: PrismaClient,
  ) {}

  list = async (query: ViewUsersQueryDTO): Promise<PaginatedUsers> => {
    const { page, limit, search, role } = query;

    const where: Prisma.UserWhereInput = {
      ...(search
        ? {
            OR: [
              { email: { contains: search, mode: "insensitive" } },
              { name: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(role ? { role } : {}),
    };

    const [total, users] = await this.prisma.$transaction([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        select: userSelect,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  };

  updateRole = async (
    adminUserId: string,
    userId: string,
    role: UpdateUserRoleDTO["role"],
  ): Promise<SafeUser> => {
    if (adminUserId === userId) {
      throw CannotModifyOwnRoleError;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });
    if (!user) {
      throw UserNotFoundError;
    }

    await this.ensureNotLastAdmin(user.role);

    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: userSelect,
    });
  };

  remove = async (adminUserId: string, userId: string): Promise<void> => {
    if (adminUserId === userId) {
      throw CannotDeleteOwnAccountError;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });
    if (!user) {
      throw UserNotFoundError;
    }

    await this.ensureNotLastAdmin(user.role);

    if (!user) {
      throw UserNotFoundError;
    }

    await this.prisma.user.delete({ where: { id: userId } });
  };

  private ensureNotLastAdmin = async (targetRole: Role) => {
    if (targetRole !== Role.ADMIN) return;

    const adminCount = await this.prisma.user.count({
      where: { role: Role.ADMIN },
    });
    if (adminCount <= 1) {
      throw CannotRemoveLastAdminError;
    }
  };
}
