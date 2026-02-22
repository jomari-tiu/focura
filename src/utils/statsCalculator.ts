import { DailyStat, Session, StreakData } from "../types";
import { getLast7DayKeys, getTodayKey, formatDateKey, daysBetween } from "./dateHelpers";

export interface WeeklyDataPoint {
  date: string;
  dayLabel: string;
  sessionsCompleted: number;
  focusMinutes: number;
}

export function getLast7Days(dailyStats: DailyStat[]): WeeklyDataPoint[] {
  const keys = getLast7DayKeys();
  const statsMap = new Map(dailyStats.map((s) => [s.date, s]));

  return keys.map((key) => {
    const stat = statsMap.get(key);
    const d = new Date(key + "T00:00:00");
    const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
    return {
      date: key,
      dayLabel,
      sessionsCompleted: stat?.sessionsCompleted ?? 0,
      focusMinutes: stat?.focusMinutes ?? 0,
    };
  });
}

export function recalculateStreak(
  dailyStats: DailyStat[],
  previousStreak: StreakData
): StreakData {
  const today = getTodayKey();

  // Sort stats descending by date
  const sorted = [...dailyStats]
    .filter((s) => s.sessionsCompleted > 0)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (sorted.length === 0) {
    return { currentStreak: 0, longestStreak: previousStreak.longestStreak, lastActiveDate: null };
  }

  const lastActive = sorted[0].date;
  const gapFromToday = daysBetween(today, lastActive);

  // Streak is broken if last active was more than 1 day ago
  if (gapFromToday > 1) {
    return {
      currentStreak: 0,
      longestStreak: previousStreak.longestStreak,
      lastActiveDate: lastActive,
    };
  }

  // Count consecutive days
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const gap = daysBetween(sorted[i - 1].date, sorted[i].date);
    if (gap === 1) {
      streak++;
    } else {
      break;
    }
  }

  return {
    currentStreak: streak,
    longestStreak: Math.max(streak, previousStreak.longestStreak),
    lastActiveDate: lastActive,
  };
}

export function getTodaySessionCount(sessions: Session[]): number {
  const today = getTodayKey();
  return sessions.filter(
    (s) => s.wasCompleted && s.completedAt.startsWith(today)
  ).length;
}

export function getCompletionRate(sessions: Session[]): number {
  if (sessions.length === 0) return 0;
  const completed = sessions.filter((s) => s.wasCompleted).length;
  return Math.round((completed / sessions.length) * 100);
}

export function getTotalFocusMinutes(dailyStats: DailyStat[]): number {
  return dailyStats.reduce((acc, s) => acc + s.focusMinutes, 0);
}

export function getTotalSessions(sessions: Session[]): number {
  return sessions.filter((s) => s.wasCompleted).length;
}
