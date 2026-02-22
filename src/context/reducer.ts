import { AppState, Session, Task, DailyStat } from "../types";
import { ACTIONS } from "./actions";
import { getTodayKey } from "../utils/dateHelpers";
import { recalculateStreak, getTodaySessionCount } from "../utils/statsCalculator";
import { SESSION_25_SECONDS } from "../constants/timer";

export const initialState: AppState = {
  tasks: [
    {
      id: "mock-task-1",
      title: "Design new landing page",
      estimatedSessions: 8,
      completedSessions: 6,
      status: "active",
      order: 0,
      createdAt: "2026-02-15T09:00:00.000Z",
    },
    {
      id: "mock-task-2",
      title: "Write quarterly report",
      estimatedSessions: 6,
      completedSessions: 6,
      status: "completed",
      order: 1,
      createdAt: "2026-02-14T09:00:00.000Z",
    },
    {
      id: "mock-task-3",
      title: "Fix authentication bug",
      estimatedSessions: 4,
      completedSessions: 2,
      status: "active",
      order: 2,
      createdAt: "2026-02-20T10:00:00.000Z",
    },
    {
      id: "mock-task-4",
      title: "Prepare team presentation",
      estimatedSessions: 3,
      completedSessions: 3,
      status: "completed",
      order: 3,
      createdAt: "2026-02-12T09:00:00.000Z",
    },
    {
      id: "mock-task-5",
      title: "Review pull requests",
      estimatedSessions: 2,
      completedSessions: 1,
      status: "active",
      order: 4,
      createdAt: "2026-02-22T08:00:00.000Z",
    },
  ],
  sessions: [
    // 2026-02-16 — 4 sessions
    { id: "mock-s1",  taskId: "mock-task-1", type: "focus", durationMinutes: 25, completedAt: "2026-02-16T10:00:00.000Z", wasCompleted: true },
    { id: "mock-s2",  taskId: "mock-task-1", type: "focus", durationMinutes: 25, completedAt: "2026-02-16T10:30:00.000Z", wasCompleted: true },
    { id: "mock-s3",  taskId: "mock-task-2", type: "focus", durationMinutes: 25, completedAt: "2026-02-16T14:00:00.000Z", wasCompleted: true },
    { id: "mock-s4",  taskId: "mock-task-2", type: "focus", durationMinutes: 25, completedAt: "2026-02-16T14:30:00.000Z", wasCompleted: true },
    // 2026-02-17 — 3 sessions
    { id: "mock-s5",  taskId: "mock-task-2", type: "focus", durationMinutes: 25, completedAt: "2026-02-17T09:00:00.000Z", wasCompleted: true },
    { id: "mock-s6",  taskId: "mock-task-2", type: "focus", durationMinutes: 25, completedAt: "2026-02-17T09:30:00.000Z", wasCompleted: true },
    { id: "mock-s7",  taskId: "mock-task-4", type: "focus", durationMinutes: 25, completedAt: "2026-02-17T14:00:00.000Z", wasCompleted: true },
    // 2026-02-18 — 4 sessions
    { id: "mock-s8",  taskId: "mock-task-1", type: "focus", durationMinutes: 25, completedAt: "2026-02-18T10:00:00.000Z", wasCompleted: true },
    { id: "mock-s9",  taskId: "mock-task-1", type: "focus", durationMinutes: 25, completedAt: "2026-02-18T10:30:00.000Z", wasCompleted: true },
    { id: "mock-s10", taskId: "mock-task-2", type: "focus", durationMinutes: 25, completedAt: "2026-02-18T15:00:00.000Z", wasCompleted: true },
    { id: "mock-s11", taskId: "mock-task-2", type: "focus", durationMinutes: 25, completedAt: "2026-02-18T15:30:00.000Z", wasCompleted: true },
    // 2026-02-19 — 2 sessions
    { id: "mock-s12", taskId: "mock-task-4", type: "focus", durationMinutes: 25, completedAt: "2026-02-19T11:00:00.000Z", wasCompleted: true },
    { id: "mock-s13", taskId: "mock-task-4", type: "focus", durationMinutes: 25, completedAt: "2026-02-19T11:30:00.000Z", wasCompleted: true },
    // 2026-02-20 — 3 sessions
    { id: "mock-s14", taskId: "mock-task-1", type: "focus", durationMinutes: 25, completedAt: "2026-02-20T09:00:00.000Z", wasCompleted: true },
    { id: "mock-s15", taskId: "mock-task-1", type: "focus", durationMinutes: 25, completedAt: "2026-02-20T09:30:00.000Z", wasCompleted: true },
    { id: "mock-s16", taskId: "mock-task-3", type: "focus", durationMinutes: 25, completedAt: "2026-02-20T14:00:00.000Z", wasCompleted: true },
    // 2026-02-21 — 2 sessions
    { id: "mock-s17", taskId: "mock-task-3", type: "focus", durationMinutes: 25, completedAt: "2026-02-21T10:00:00.000Z", wasCompleted: true },
    { id: "mock-s18", taskId: null,           type: "focus", durationMinutes: 25, completedAt: "2026-02-21T15:00:00.000Z", wasCompleted: true },
    // 2026-02-22 — 2 sessions (today)
    { id: "mock-s19", taskId: null,           type: "focus", durationMinutes: 25, completedAt: "2026-02-22T09:00:00.000Z", wasCompleted: true },
    { id: "mock-s20", taskId: "mock-task-5",  type: "focus", durationMinutes: 25, completedAt: "2026-02-22T10:00:00.000Z", wasCompleted: true },
  ],
  dailyStats: [
    { date: "2026-02-16", sessionsCompleted: 4, focusMinutes: 100 },
    { date: "2026-02-17", sessionsCompleted: 3, focusMinutes: 75  },
    { date: "2026-02-18", sessionsCompleted: 4, focusMinutes: 100 },
    { date: "2026-02-19", sessionsCompleted: 2, focusMinutes: 50  },
    { date: "2026-02-20", sessionsCompleted: 3, focusMinutes: 75  },
    { date: "2026-02-21", sessionsCompleted: 2, focusMinutes: 50  },
    { date: "2026-02-22", sessionsCompleted: 2, focusMinutes: 50  },
  ],
  settings: {
    defaultSessionLength: 25,
    dailyGoal: 8,
    themeMode: "dark",
    notificationsEnabled: true,
  },
  streak: {
    currentStreak: 7,
    longestStreak: 7,
    lastActiveDate: "2026-02-22",
  },
  timer: {
    status: "idle",
    remainingSeconds: SESSION_25_SECONDS,
    totalSeconds: SESSION_25_SECONDS,
    activeTaskId: null,
    currentSessionType: "focus",
  },
  hasCompletedOnboarding: true,
  todaySessionCount: 2,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function reducer(state: AppState, action: { type: string; payload?: any }): AppState {
  switch (action.type) {
    case ACTIONS.HYDRATE: {
      const loaded = action.payload as Partial<AppState>;
      return {
        ...state,
        ...loaded,
        // Always reset timer to idle on boot
        timer: {
          ...state.timer,
          status: "idle",
          remainingSeconds: loaded.settings?.defaultSessionLength
            ? loaded.settings.defaultSessionLength * 60
            : SESSION_25_SECONDS,
          totalSeconds: loaded.settings?.defaultSessionLength
            ? loaded.settings.defaultSessionLength * 60
            : SESSION_25_SECONDS,
        },
        todaySessionCount: getTodaySessionCount(loaded.sessions ?? []),
      };
    }

    case ACTIONS.TIMER_START:
      return {
        ...state,
        timer: { ...state.timer, status: "running" },
      };

    case ACTIONS.TIMER_PAUSE:
      return {
        ...state,
        timer: { ...state.timer, status: "paused" },
      };

    case ACTIONS.TIMER_RESET: {
      const secs = state.settings.defaultSessionLength * 60;
      return {
        ...state,
        timer: {
          ...state.timer,
          status: "idle",
          remainingSeconds: secs,
          totalSeconds: secs,
        },
      };
    }

    case ACTIONS.TIMER_TICK: {
      const newRemaining = state.timer.remainingSeconds - 1;
      if (newRemaining <= 0) {
        return {
          ...state,
          timer: { ...state.timer, remainingSeconds: 0, status: "completed" },
        };
      }
      return {
        ...state,
        timer: { ...state.timer, remainingSeconds: newRemaining },
      };
    }

    case ACTIONS.TIMER_COMPLETE: {
      const today = getTodayKey();
      const durationMinutes = state.settings.defaultSessionLength;

      // Create a new session record
      const newSession: Session = {
        id: Date.now().toString(),
        taskId: state.timer.activeTaskId,
        type: "focus",
        durationMinutes,
        completedAt: new Date().toISOString(),
        wasCompleted: true,
      };

      // Update task completedSessions if there's an active task
      let updatedTasks = state.tasks;
      if (state.timer.activeTaskId) {
        updatedTasks = state.tasks.map((t) =>
          t.id === state.timer.activeTaskId
            ? { ...t, completedSessions: t.completedSessions + 1 }
            : t
        );
      }

      // Update daily stats
      const existingStat = state.dailyStats.find((s) => s.date === today);
      let updatedStats: DailyStat[];
      if (existingStat) {
        updatedStats = state.dailyStats.map((s) =>
          s.date === today
            ? {
                ...s,
                sessionsCompleted: s.sessionsCompleted + 1,
                focusMinutes: s.focusMinutes + durationMinutes,
              }
            : s
        );
      } else {
        updatedStats = [
          ...state.dailyStats,
          { date: today, sessionsCompleted: 1, focusMinutes: durationMinutes },
        ];
      }

      const updatedSessions = [...state.sessions, newSession];
      const newStreak = recalculateStreak(updatedStats, state.streak);
      const secs = state.settings.defaultSessionLength * 60;

      return {
        ...state,
        tasks: updatedTasks,
        sessions: updatedSessions,
        dailyStats: updatedStats,
        streak: newStreak,
        todaySessionCount: state.todaySessionCount + 1,
        timer: {
          ...state.timer,
          status: "idle",
          remainingSeconds: secs,
          totalSeconds: secs,
        },
      };
    }

    case ACTIONS.TIMER_SET_DURATION: {
      const minutes = action.payload as 25 | 50;
      const secs = minutes * 60;
      return {
        ...state,
        settings: { ...state.settings, defaultSessionLength: minutes },
        timer: {
          ...state.timer,
          status: "idle",
          remainingSeconds: secs,
          totalSeconds: secs,
        },
      };
    }

    case ACTIONS.TIMER_SET_TASK:
      return {
        ...state,
        timer: { ...state.timer, activeTaskId: action.payload },
      };

    case ACTIONS.TASK_ADD: {
      const newTask: Task = {
        id: Date.now().toString(),
        title: action.payload.title,
        estimatedSessions: action.payload.estimatedSessions ?? 4,
        completedSessions: 0,
        status: "active",
        order: state.tasks.length,
        createdAt: new Date().toISOString(),
      };
      return { ...state, tasks: [...state.tasks, newTask] };
    }

    case ACTIONS.TASK_UPDATE:
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };

    case ACTIONS.TASK_DELETE:
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
        timer:
          state.timer.activeTaskId === action.payload
            ? { ...state.timer, activeTaskId: null }
            : state.timer,
      };

    case ACTIONS.TASK_REORDER:
      return {
        ...state,
        tasks: (action.payload as Task[]).map((t, i) => ({ ...t, order: i })),
      };

    case ACTIONS.TASK_COMPLETE:
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload ? { ...t, status: "completed" as const } : t
        ),
      };

    case ACTIONS.SETTINGS_UPDATE:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    case ACTIONS.ONBOARDING_COMPLETE:
      return { ...state, hasCompletedOnboarding: true };

    case ACTIONS.RESET_ALL_DATA:
      return { ...initialState, hasCompletedOnboarding: true };

    default:
      return state;
  }
}
