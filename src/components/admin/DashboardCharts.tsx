"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ReactNode } from "react";

import type {
  DashboardDeviceTotal,
  DashboardLinkTotal,
  DashboardPageTotal,
  DailyAnalyticsPoint,
} from "@/types/dashboard";

const chartColors = ["#0e5673", "#2b7a68", "#b88735", "#6b7280"] as const;
const tooltipStyle = {
  background: "#ffffff",
  border: "1px solid #cddbd7",
  borderRadius: "0.75rem",
  color: "#15313b",
  fontSize: "0.8125rem",
} as const;

type DataTableProps = {
  caption: string;
  headers: string[];
  rows: (string | number)[][];
};

function ChartDataTable({ caption, headers, rows }: DataTableProps) {
  return (
    <details className="mt-4 rounded-xl border border-border bg-surface-muted/55 px-4 py-3">
      <summary className="cursor-pointer text-sm font-semibold text-primary">
        View accessible data table
      </summary>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-80 border-collapse text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              {headers.map((header) => (
                <th className="border-b border-border px-2 py-2 font-semibold" key={header} scope="col">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`${caption}-${rowIndex}`}>
                {row.map((value, columnIndex) => (
                  <td className="border-b border-border/70 px-2 py-2" key={`${rowIndex}-${columnIndex}`}>
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

type ChartCardProps = {
  children: ReactNode;
  description: string;
  empty: boolean;
  emptyMessage: string;
  id: string;
  summary: ReactNode;
  title: string;
};

function ChartCard({
  children,
  description,
  empty,
  emptyMessage,
  id,
  summary,
  title,
}: ChartCardProps) {
  return (
    <article className="rounded-card border border-border bg-surface p-5 shadow-soft sm:p-6">
      <h3 className="text-lg font-semibold" id={id}>
        {title}
      </h3>
      <p className="mt-1 text-sm leading-6 text-foreground/60">{description}</p>
      {empty ? (
        <div
          className="mt-5 grid min-h-72 place-items-center rounded-xl border border-dashed border-border bg-surface-muted/50 p-6 text-center"
          role="status"
        >
          <p className="max-w-sm text-sm leading-6 text-foreground/65">{emptyMessage}</p>
        </div>
      ) : (
        <div aria-labelledby={id} className="mt-5 h-72 w-full" role="img">
          {children}
        </div>
      )}
      {summary}
    </article>
  );
}

type DashboardChartsProps = {
  daily: DailyAnalyticsPoint[];
  devices: DashboardDeviceTotal[];
  links: DashboardLinkTotal[];
  pages: DashboardPageTotal[];
};

export function DashboardCharts({
  daily,
  devices,
  links,
  pages,
}: DashboardChartsProps) {
  const hasVisitors = daily.some((point) => point.uniqueVisitors > 0);
  const hasPageViews = daily.some((point) => point.pageViews > 0);
  const hasLinks = links.some((item) => item.total > 0);
  const hasDevices = devices.some((item) => item.total > 0);
  const hasPages = pages.some((item) => item.total > 0);

  return (
    <section aria-labelledby="dashboard-charts-heading" className="mt-9">
      <p className="text-xs font-semibold tracking-[0.18em] text-secondary uppercase">
        Trends
      </p>
      <h2 className="mt-2 text-2xl font-semibold" id="dashboard-charts-heading">
        Analytics charts
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-foreground/60">
        Charts are paired with expandable tables so the same information is available without relying on shape or color.
      </p>

      <div className="mt-4 grid gap-5 xl:grid-cols-2">
        <ChartCard
          description="Distinct anonymous visitor IDs for each Asia/Manila day."
          empty={!hasVisitors}
          emptyMessage="No visitor activity was recorded in this period."
          id="daily-visitors-chart"
          summary={
            <ChartDataTable
              caption="Daily unique visitors"
              headers={["Date", "Estimated visitors"]}
              rows={daily.map((point) => [point.date, point.uniqueVisitors])}
            />
          }
          title="Daily unique visitors"
        >
          <ResponsiveContainer height="100%" initialDimension={{ height: 288, width: 560 }} width="100%">
            <LineChart accessibilityLayer data={daily} margin={{ bottom: 8, left: -18, right: 8, top: 8 }}>
              <CartesianGrid stroke="#dbe5e2" strokeDasharray="4 4" />
              <XAxis dataKey="label" minTickGap={28} stroke="#53666d" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} stroke="#53666d" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                dataKey="uniqueVisitors"
                dot={false}
                isAnimationActive={false}
                name="Estimated visitors"
                stroke="#0e5673"
                strokeWidth={3}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          description="All public-route page-view records for each Asia/Manila day."
          empty={!hasPageViews}
          emptyMessage="No page views were recorded in this period."
          id="page-views-chart"
          summary={
            <ChartDataTable
              caption="Daily page views"
              headers={["Date", "Page views"]}
              rows={daily.map((point) => [point.date, point.pageViews])}
            />
          }
          title="Page-view trend"
        >
          <ResponsiveContainer height="100%" initialDimension={{ height: 288, width: 560 }} width="100%">
            <LineChart accessibilityLayer data={daily} margin={{ bottom: 8, left: -18, right: 8, top: 8 }}>
              <CartesianGrid stroke="#dbe5e2" strokeDasharray="4 4" />
              <XAxis dataKey="label" minTickGap={28} stroke="#53666d" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} stroke="#53666d" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                dataKey="pageViews"
                dot={false}
                isAnimationActive={false}
                name="Page views"
                stroke="#2b7a68"
                strokeWidth={3}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          description="Recorded clicks grouped by approved external-link type."
          empty={!hasLinks}
          emptyMessage="No external-link clicks were recorded in this period."
          id="external-links-chart"
          summary={
            <ChartDataTable
              caption="External-link click totals"
              headers={["Link type", "Clicks"]}
              rows={links.map((item) => [item.label, item.total])}
            />
          }
          title="External-link clicks"
        >
          <ResponsiveContainer height="100%" initialDimension={{ height: 288, width: 560 }} width="100%">
            <BarChart accessibilityLayer data={links} margin={{ bottom: 48, left: -18, right: 8, top: 8 }}>
              <CartesianGrid stroke="#dbe5e2" strokeDasharray="4 4" />
              <XAxis
                angle={-32}
                dataKey="label"
                interval={0}
                stroke="#53666d"
                textAnchor="end"
                tick={{ fontSize: 11 }}
              />
              <YAxis allowDecimals={false} stroke="#53666d" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="total" fill="#0e5673" isAnimationActive={false} name="Clicks" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          description="Page views grouped into coarse, privacy-safe device categories."
          empty={!hasDevices}
          emptyMessage="No device information was recorded in this period."
          id="device-chart"
          summary={
            <ChartDataTable
              caption="Device distribution"
              headers={["Device", "Page views"]}
              rows={devices.map((item) => [item.label, item.total])}
            />
          }
          title="Device distribution"
        >
          <ResponsiveContainer height="100%" initialDimension={{ height: 288, width: 560 }} width="100%">
            <PieChart accessibilityLayer>
              <Pie
                cx="50%"
                cy="45%"
                data={devices}
                dataKey="total"
                innerRadius={54}
                isAnimationActive={false}
                nameKey="label"
                outerRadius={88}
                paddingAngle={2}
              >
                {devices.map((item, index) => (
                  <Cell fill={chartColors[index % chartColors.length]} key={item.deviceType} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          description="Normalized public paths ordered by page-view count."
          empty={!hasPages}
          emptyMessage="No pages were viewed in this period."
          id="top-pages-chart"
          summary={
            <ChartDataTable
              caption="Most-viewed pages"
              headers={["Path", "Page views"]}
              rows={pages.map((item) => [item.path, item.total])}
            />
          }
          title="Most-viewed pages"
        >
          <ResponsiveContainer height="100%" initialDimension={{ height: 288, width: 560 }} width="100%">
            <BarChart accessibilityLayer data={pages} layout="vertical" margin={{ bottom: 8, left: 16, right: 12, top: 8 }}>
              <CartesianGrid horizontal={false} stroke="#dbe5e2" strokeDasharray="4 4" />
              <XAxis allowDecimals={false} stroke="#53666d" tick={{ fontSize: 12 }} type="number" />
              <YAxis dataKey="path" stroke="#53666d" tick={{ fontSize: 11 }} type="category" width={110} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="total" fill="#b88735" isAnimationActive={false} name="Page views" radius={[0, 5, 5, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </section>
  );
}

