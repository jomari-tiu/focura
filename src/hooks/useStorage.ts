import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback } from "react";

export function useStorage() {
  const getItem = useCallback(async <T>(key: string): Promise<T | null> => {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }, []);

  const setItem = useCallback(async <T>(key: string, value: T): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("[useStorage] setItem error:", e);
    }
  }, []);

  const removeItem = useCallback(async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn("[useStorage] removeItem error:", e);
    }
  }, []);

  return { getItem, setItem, removeItem };
}
