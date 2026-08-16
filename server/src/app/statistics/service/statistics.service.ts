import { inject, injectable } from "tsyringe";
import type { PrismaClient } from "../../../generated/prisma/client.js";
import { TOKENS } from "../../../lib/di/tokens.js";
import type {
  AdminStats,
  FileTypeDistribution,
  UploadHistoryEntry,
  UserStats,
} from "../types.js";

function toFriendlyType(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "Image";
  if (mimeType.startsWith("video/")) return "Video";
  if (mimeType.startsWith("audio/")) return "Audio";
  if (mimeType.startsWith("text/")) return "Text";
  if (mimeType === "application/pdf") return "PDF";
  
  if (
    mimeType === "application/msword" ||
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "Word";
  }
  return "Other";
}

function buildDistribution(
  groups: { mimeType: string; _count: { id: number } }[],
): FileTypeDistribution[] {
  const buckets = new Map<string, number>();
  for (const group of groups) {
    const key = toFriendlyType(group.mimeType);
    buckets.set(key, (buckets.get(key) ?? 0) + group._count.id);
  }
  return Array.from(buckets.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
}

function fillUploadHistory(
  raw: { day: string; count: number }[],
  period: number,
): UploadHistoryEntry[] {
  const now = new Date();
  const map = new Map<string, number>();

  for (let i = 0; i < period; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    map.set(d.toISOString().slice(0, 10), 0);
  }

  for (const row of raw) {
    const key = row.day.slice(0, 10);
    if (map.has(key)) {
      map.set(key, row.count);
    }
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}

@injectable()
export class StatisticsService {
  constructor(
    @inject(TOKENS.PrismaClient) private readonly prisma: PrismaClient,
  ) {}

  getUserStats = async (userId: string, period: number): Promise<UserStats> => {
    const since = new Date();
    since.setDate(since.getDate() - period);

    const [totalFiles, storageAgg, totalFolders, typeGroups, rawHistory] =
      await Promise.all([
        this.prisma.file.count({ where: { userId } }),
        this.prisma.file.aggregate({
          _sum: { size: true },
          where: { userId },
        }),
        this.prisma.folder.count({ where: { userId } }),
        this.prisma.file.groupBy({
          by: ["mimeType"],
          _count: { id: true },
          where: { userId },
        }),
        this.prisma.$queryRaw<{ day: string; count: number }[]>`
        SELECT
          date_trunc('day', "createdAt")::text AS day,
          COUNT(*)::int AS count
        FROM "files"
        WHERE "userId" = ${userId}
          AND "createdAt" >= ${since}
        GROUP BY day
        ORDER BY day
      `,
      ]);

    return {
      totalFiles,
      totalFolders,
      storageUsed: storageAgg._sum.size ?? 0,
      fileTypeDistribution: buildDistribution(typeGroups),
      uploadHistory: fillUploadHistory(rawHistory, period),
    };
  };

  getAdminStats = async (): Promise<AdminStats> => {
    const [totalUsers, totalFiles, storageAgg, typeGroups, recentUploads] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.file.count(),
        this.prisma.file.aggregate({ _sum: { size: true } }),
        this.prisma.file.groupBy({
          by: ["mimeType"],
          _count: { id: true },
        }),
        this.prisma.file.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            size: true,
            mimeType:true,
            url: true,
            createdAt: true,
            user: { select: { name: true, email: true } },
          },
        }),
      ]);

    return {
      totalUsers,
      totalFiles,
      storageUsed: storageAgg._sum.size ?? 0,
      fileTypeDistribution: buildDistribution(typeGroups),
      recentUploads,
    };
  };
}
