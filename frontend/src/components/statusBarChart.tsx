"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  type ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { type Application, type ApplicationStatus } from "@/types";

interface StatusBarChartProps {
  applications: Application[];
  className?: string;
}

const statusOrder: ApplicationStatus[] = [
  "applied",
  "interviewing",
  "offer",
  "rejected",
  "ghosted",
];

const statusConfig = {
  applied: {
    label: "Applied",
    color: "var(--chart-1)",
  },
  interviewing: {
    label: "Interviewing",
    color: "var(--chart-2)",
  },
  offer: {
    label: "Offer",
    color: "var(--chart-3)",
  },
  rejected: {
    label: "Rejected",
    color: "var(--chart-4)",
  },
  ghosted: {
    label: "Ghosted",
    color: "#0f4c5c",
  },
} satisfies ChartConfig;

export function StatusBarChart({
  applications,
  className,
}: StatusBarChartProps) {
  const statusCounts = statusOrder.reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {} as Record<ApplicationStatus, number>);

  applications.forEach((app) => {
    if (statusCounts.hasOwnProperty(app.status)) {
      statusCounts[app.status]++;
    }
  });

  const chartData = [{ name: "Applications", ...statusCounts }];

  return (
    <ChartContainer config={statusConfig} className="min-h-50 w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="applied" fill="var(--color-applied)" radius={4} />
        <Bar
          dataKey="interviewing"
          fill="var(--color-interviewing)"
          radius={4}
        />
        <Bar dataKey="offer" fill="var(--color-offer)" radius={4} />
        <Bar dataKey="rejected" fill="var(--color-rejected)" radius={4} />
        <Bar dataKey="ghosted" fill="var(--color-ghosted)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
