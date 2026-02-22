import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "../types";
import { reducer, initialState } from "./reducer";
import { ACTIONS } from "./actions";
import { STORAGE_KEYS } from "../utils/storageKeys";

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<{ type: string; payload?: any }>;
}

const AppContext = createContext<AppContextValue | null>(null);

const PERSIST_DEBOUNCE_MS = 500;

const EXCLUDED_KEYS: (keyof AppState)[] = ["timer", "todaySessionCount"];

function serializeState(state: AppState): Partial<AppState> {
  const result: Partial<AppState> = { ...state };
  EXCLUDED_KEYS.forEach((key) => delete result[key]);
  return result;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHydrated = useRef(false);

  // Load state from AsyncStorage on mount
  useEffect(() => {
    async function hydrate() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.APP_STATE);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<AppState>;
          dispatch({ type: ACTIONS.HYDRATE, payload: parsed });
        }
      } catch (e) {
        console.warn("[Focura] Failed to hydrate state:", e);
      } finally {
        isHydrated.current = true;
      }
    }
    hydrate();
  }, []);

  // Debounced persist on state change
  useEffect(() => {
    if (!isHydrated.current) return;

    if (persistTimer.current) {
      clearTimeout(persistTimer.current);
    }

    persistTimer.current = setTimeout(async () => {
      try {
        const toSave = serializeState(state);
        await AsyncStorage.setItem(
          STORAGE_KEYS.APP_STATE,
          JSON.stringify(toSave),
        );
      } catch (e) {
        console.warn("[Focura] Failed to persist state:", e);
      }
    }, PERSIST_DEBOUNCE_MS);

    return () => {
      if (persistTimer.current) clearTimeout(persistTimer.current);
    };
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return ctx;
}

export function useAppState(): AppState {
  return useAppContext().state;
}

export function useAppDispatch(): React.Dispatch<{
  type: string;
  payload?: any;
}> {
  return useAppContext().dispatch;
}
