const ZONE = "Europe/Bucharest";

/** Offset of Romanian local time from UTC, in minutes, at a given instant (handles summer time). */
function zoneOffset(utcMs: number): number {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: ZONE,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
      .formatToParts(new Date(utcMs))
      .map((part) => [part.type, part.value]),
  );
  const local = Date.UTC(+parts.year!, +parts.month! - 1, +parts.day!, +parts.hour!, +parts.minute!, +parts.second!);
  return Math.round((local - utcMs) / 60000);
}

export type BlogDate = { date: Date; iso: string; ymd: string };

/**
 * "2026-11-12" or "2026-11-12 09:30" (Romanian local time) -> instant plus an
 * ISO 8601 string with the correct offset, as Google expects in structured data.
 * Without a time the article counts as published at 08:00.
 */
export function parseBlogDate(raw: string): BlogDate | null {
  const m = raw.trim().match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?$/);
  if (!m) return null;
  const [y, mo, d, h = "08", mi = "00"] = m.slice(1) as [string, string, string, string?, string?];
  const naive = Date.UTC(+y, +mo - 1, +d, +h, +mi);
  if (Number.isNaN(naive) || new Date(naive).getUTCDate() !== +d) return null;
  const offset = zoneOffset(naive - zoneOffset(naive) * 60000);
  const date = new Date(naive - offset * 60000);
  const sign = offset >= 0 ? "+" : "-";
  const abs = Math.abs(offset);
  const tz = `${sign}${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`;
  return { date, iso: `${y}-${mo}-${d}T${h}:${mi}:00${tz}`, ymd: `${y}-${mo}-${d}` };
}

const display = new Intl.DateTimeFormat("ro-RO", { day: "numeric", month: "long", year: "numeric", timeZone: ZONE });
const short = new Intl.DateTimeFormat("ro-RO", { day: "numeric", month: "short", year: "numeric", timeZone: ZONE });

export const formatDate = (date: Date) => display.format(date);
export const formatShortDate = (date: Date) => short.format(date).replace(".", "");
