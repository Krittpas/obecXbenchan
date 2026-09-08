export const TZ = "Asia/Bangkok";

export function buddhistYear(date: Date): number {
  return date.getFullYear() + 543;
}

function parts(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** 9 กันยายน 2569 */
export function thaiDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = parts(iso);
  if (!d) return "—";
  const day = new Intl.DateTimeFormat("th-TH", { timeZone: TZ, day: "numeric" }).format(d);
  const month = new Intl.DateTimeFormat("th-TH", { timeZone: TZ, month: "long" }).format(d);
  const year = new Intl.DateTimeFormat("th-TH-u-ca-buddhist", { timeZone: TZ, year: "numeric" }).format(d);
  return `${day} ${month} ${year.replace(/[^0-9]/g, "")}`;
}

/** พุธที่ 9 กันยายน 2569 */
export function thaiDateFull(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = parts(iso);
  if (!d) return "—";
  const weekday = new Intl.DateTimeFormat("th-TH", { timeZone: TZ, weekday: "long" }).format(d);
  return `${weekday}ที่ ${thaiDate(iso)}`;
}

/** 09:30 น. */
export function thaiTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = parts(iso);
  if (!d) return "—";
  const t = new Intl.DateTimeFormat("th-TH", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
  return `${t} น.`;
}

/** 9 ก.ย. · 09:30 น. */
export function thaiDateTimeShort(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = parts(iso);
  if (!d) return "—";
  const date = new Intl.DateTimeFormat("th-TH", { timeZone: TZ, day: "numeric", month: "short" }).format(d);
  return `${date} · ${thaiTime(iso)}`;
}

/** ช่วงวันที่แบบไทย ถ้าเป็นวันเดียวกันจะแสดงวันเดียว */
export function thaiDateRange(startISO: string, endISO: string): string {
  const start = thaiDate(startISO);
  const end = thaiDate(endISO);
  return start === end ? start : `${start} – ${end}`;
}

/** เวลาแบบสั้น 07:30 (ไม่มีคำว่า น.) */
export function clockTime(iso: string | null | undefined): string {
  return thaiTime(iso).replace(" น.", "");
}

export function slugify(input: string): string {
  const base = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9฀-๿]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || `item-${Date.now().toString(36)}`;
}

export function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

/** ค่า iso → ค่าที่ใส่ใน <input type="datetime-local"> โดยอิงเวลาไทย */
export function toDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const p = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (type: string) => p.find((x) => x.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

/** ค่า iso → ค่าที่ใส่ใน <input type="date"> โดยอิงเวลาไทย */
export function toDateInput(iso: string | null | undefined): string {
  return toDatetimeLocal(iso).slice(0, 10);
}

/**
 * ค่าจาก <input type="datetime-local"> ถือเป็นเวลาไทยเสมอ
 * เพื่อไม่ให้เวลาเพี้ยนเมื่อเซิร์ฟเวอร์รันในโซน UTC
 */
export function parseBangkokLocal(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const withOffset = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(trimmed)
    ? `${trimmed}:00+07:00`
    : /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
      ? `${trimmed}T00:00:00+07:00`
      : trimmed;
  const d = new Date(withOffset);
  return Number.isNaN(d.getTime()) ? null : d;
}
