import { AppState, Session, Task, DailyStat } from "../types";
import { ACTIONS } from "./actions";
import { getTodayKey } from "../utils/dateHelpers";
import { recalculateStreak, getTodaySessionCount } from "../utils/statsCalculator";
import { SESSION_25_SECONDS } from "../constants/timer";

export const initialState: AppState = {
  tasks: [],
  sessions: [],
  dailyStats: [],
  settings: {
    defaultSessionLength: 25,
    dailyGoal: 8,
    themeMode: "dark",
    notificationsEnabled: true,
  },
  streak: {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
  },
  timer: {
    status: "idle",
    remainingSeconds: SESSION_25_SECONDS,
    totalSeconds: SESSION_25_SECONDS,
    activeTaskId: null,
    currentSessionType: "focus",
  },
  hasCompletedOnboarding: false,
  todaySessionCount: 0,
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
