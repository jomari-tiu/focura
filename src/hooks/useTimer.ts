import { useEffect, useRef, useCallback } from "react";
import { useAppContext } from "../context/AppContext";
import { ACTIONS } from "../context/actions";
import { useHaptics } from "./useHaptics";
import { useNotifications } from "./useNotifications";

export function useTimer() {
  const { state, dispatch } = useAppContext();
  const { timer } = state;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { triggerSuccess } = useHaptics();
  const { sendCompletionNotification } = useNotifications();

  // Tick every second when running
  useEffect(() => {
    if (timer.status === "running") {
      intervalRef.current = setInterval(() => {
        dispatch({ type: ACTIONS.TIMER_TICK });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timer.status, dispatch]);

  // Watch for completion
  useEffect(() => {
    if (timer.status === "completed") {
      dispatch({ type: ACTIONS.TIMER_COMPLETE });
      triggerSuccess();
      sendCompletionNotification();
    }
  }, [timer.status, dispatch, triggerSuccess, sendCompletionNotification]);

  const start = useCallback(() => {
    dispatch({ type: ACTIONS.TIMER_START });
  }, [dispatch]);

  const pause = useCallback(() => {
    dispatch({ type: ACTIONS.TIMER_PAUSE });
  }, [dispatch]);

  const reset = useCallback(() => {
    dispatch({ type: ACTIONS.TIMER_RESET });
  }, [dispatch]);

  return { start, pause, reset, timer };
}
