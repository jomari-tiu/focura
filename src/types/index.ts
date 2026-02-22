export type TaskStatus = "active" | "completed" | "archived";
export type SessionType = "focus" | "break";
export type TimerStatus = "idle" | "running" | "paused" | "completed";
export type ThemeMode = "dark" | "light";
export type SessionLength = 25 | 50;

export interface Task {
  id: string;
  title: string;
  estimatedSessions: number;
  completedSessions: number;
  status: TaskStatus;
  order: number;
  createdAt: string; // ISO string
}

export interface Session {
  id: string;
  taskId: string | null;
  type: SessionType;
  durationMinutes: number;
  completedAt: string; // ISO string
  wasCompleted: boolean;
}

export interface DailyStat {
  date: string; // YYYY-MM-DD
  sessionsCompleted: number;
  focusMinutes: number;
}

export interface Settings {
  defaultSessionLength: SessionLength;
  dailyGoal: number;
  themeMode: ThemeMode;
  notificationsEnabled: boolean;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null; // YYYY-MM-DD
}

export interface TimerState {
  status: TimerStatus;
  remainingSeconds: number;
  totalSeconds: number;
  activeTaskId: string | null;
  currentSessionType: SessionType;
}

export interface AppState {
  tasks: Task[];
  sessions: Session[];
  dailyStats: DailyStat[];
  settings: Settings;
  streak: StreakData;
  timer: TimerState;
  hasCompletedOnboarding: boolean;
  todaySessionCount: number;
}
