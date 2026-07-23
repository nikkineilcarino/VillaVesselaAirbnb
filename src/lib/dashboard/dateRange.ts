import { z } from "zod";

import type {
  DashboardDateRange,
  DashboardRangePreset,
} from "@/types/dashboard";
import { dashboardRangePresets } from "@/types/dashboard";

const MANILA_TIME_ZONE = "Asia/Manila";
const MAX_RANGE_DAYS = 366;
const MILLISECONDS_PER_DAY = 86_400_000;

const calendarDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  });

type DashboardSearchParams = Record<string, string | string[] | undefined>;

export type DashboardDateRangeResult =
  | { range: DashboardDateRange; success: true }
  | { message: string; success: false; today: string };

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function getManilaCalendarDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone: MANILA_TIME_ZONE,
    year: "numeric",
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));

  return `${values.year}-${values.month}-${values.day}`;
}

export function addCalendarDays(value: string, amount: number) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

export function countInclusiveCalendarDays(startDate: string, endDate: string) {
  const start = new Date(`${startDate}T00:00:00Z`).getTime();
  const end = new Date(`${endDate}T00:00:00Z`).getTime();
  return Math.floor((end - start) / MILLISECONDS_PER_DAY) + 1;
}

function formatRangeLabel(startDate: string, endDate: string) {
  const formatter = new Intl.DateTimeFormat("en-PH", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  });

  if (startDate === endDate) {
    return formatter.format(new Date(`${startDate}T00:00:00Z`));
  }

  return `${formatter.format(new Date(`${startDate}T00:00:00Z`))} – ${formatter.format(
    new Date(`${endDate}T00:00:00Z`),
  )}`;
}

function createRange(
  preset: DashboardRangePreset,
  startDate: string,
  endDate: string,
  today: string,
): DashboardDateRange {
  const endExclusiveDate = addCalendarDays(endDate, 1);

  return {
    endDate,
    endExclusiveUtc: new Date(`${endExclusiveDate}T00:00:00+08:00`).toISOString(),
    label: formatRangeLabel(startDate, endDate),
    preset,
    startDate,
    startUtc: new Date(`${startDate}T00:00:00+08:00`).toISOString(),
    today,
  };
}

export function resolveDashboardDateRange(
  searchParams: DashboardSearchParams,
  now = new Date(),
): DashboardDateRangeResult {
  const today = getManilaCalendarDate(now);
  const rawPreset = firstValue(searchParams.range);
  const preset = rawPreset ?? "30d";

  if (!dashboardRangePresets.includes(preset as DashboardRangePreset)) {
    return {
      message: "Choose one of the available date ranges.",
      success: false,
      today,
    };
  }

  if (preset === "today") {
    return { range: createRange("today", today, today, today), success: true };
  }

  if (preset === "7d") {
    return {
      range: createRange("7d", addCalendarDays(today, -6), today, today),
      success: true,
    };
  }

  if (preset === "30d") {
    return {
      range: createRange("30d", addCalendarDays(today, -29), today, today),
      success: true,
    };
  }

  if (preset === "month") {
    return {
      range: createRange("month", `${today.slice(0, 8)}01`, today, today),
      success: true,
    };
  }

  const startResult = calendarDateSchema.safeParse(firstValue(searchParams.start));
  const endResult = calendarDateSchema.safeParse(firstValue(searchParams.end));

  if (!startResult.success || !endResult.success) {
    return {
      message: "Enter a valid start and end date for the custom range.",
      success: false,
      today,
    };
  }

  const startDate = startResult.data;
  const endDate = endResult.data;
  const inclusiveDays = countInclusiveCalendarDays(startDate, endDate);

  if (startDate > endDate) {
    return {
      message: "The end date must be the same as or later than the start date.",
      success: false,
      today,
    };
  }

  if (endDate > today) {
    return {
      message: "Dashboard ranges cannot extend beyond today in Asia/Manila.",
      success: false,
      today,
    };
  }

  if (inclusiveDays > MAX_RANGE_DAYS) {
    return {
      message: `Choose a custom range of ${MAX_RANGE_DAYS} days or fewer.`,
      success: false,
      today,
    };
  }

  return {
    range: createRange("custom", startDate, endDate, today),
    success: true,
  };
}

export function listCalendarDates(startDate: string, endDate: string) {
  const dates: string[] = [];

  for (let date = startDate; date <= endDate; date = addCalendarDays(date, 1)) {
    dates.push(date);
  }

  return dates;
}

export const dashboardDateRangeConstants = {
  maxRangeDays: MAX_RANGE_DAYS,
  timeZone: MANILA_TIME_ZONE,
} as const;

