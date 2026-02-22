import { format, parseISO, isToday, isYesterday, differenceInDays } from "date-fns";

export function getTodayKey(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function formatDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function formatShortDay(dateKey: string): string {
  return format(parseISO(dateKey), "EEE");
}

export function formatFullDate(dateKey: string): string {
  return format(parseISO(dateKey), "MMM d, yyyy");
}

export function isDateToday(dateKey: string): boolean {
  return isToday(parseISO(dateKey));
}

export function isDateYesterday(dateKey: string): boolean {
  return isYesterday(parseISO(dateKey));
}

export function daysBetween(dateKeyA: string, dateKeyB: string): number {
  return differenceInDays(parseISO(dateKeyA), parseISO(dateKeyB));
}

export function getLast7DayKeys(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(formatDateKey(d));
  }
  return days;
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
