"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import type { FileTypeDistribution } from "@/lib/api-types";

interface FileTypeChartProps {
  data: FileTypeDistribution[];
}

const COLORS = [
  "#09090b",
  "#27272a",
  "#52525b",
  "#71717a",
  "#a1a1aa",
  "#d4d4d8",
  "#e4e4e7",
];
export function FileTypeChart({ data }: FileTypeChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  const chartConfig = Object.fromEntries(
    data.map((item, i) => [
      item.type,
      {
        label: item.type,
        color: COLORS[i % COLORS.length],
      },
    ]),
  ) satisfies ChartConfig;

  const chartData = data.map((item) => ({
    ...item,
    fill: COLORS[data.indexOf(item) % COLORS.length],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>File Types</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-62 w-full">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <span className="font-mono font-medium">
                      {name}: {value} (
                      {total > 0
                        ? Math.round((Number(value) / total) * 100)
                        : 0}
                      %)
                    </span>
                  )}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={50}
              strokeWidth={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} stroke={entry.fill} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent className="hidden lg:flex" />}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
