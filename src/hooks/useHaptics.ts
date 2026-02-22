import * as Haptics from "expo-haptics";
import { useCallback } from "react";
import { Platform } from "react-native";

function safeHaptic(fn: () => Promise<void>) {
  if (Platform.OS === "web") return;
  fn().catch(() => {
    // Haptics may not be available on all devices
  });
}

export function useHaptics() {
  const triggerLight = useCallback(() => {
    safeHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
  }, []);

  const triggerMedium = useCallback(() => {
    safeHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
  }, []);

  const triggerHeavy = useCallback(() => {
    safeHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy));
  }, []);

  const triggerSuccess = useCallback(() => {
    safeHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
  }, []);

  const triggerWarning = useCallback(() => {
    safeHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
  }, []);

  const triggerError = useCallback(() => {
    safeHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
  }, []);

  const triggerSelection = useCallback(() => {
    safeHaptic(() => Haptics.selectionAsync());
  }, []);

  return {
    triggerLight,
    triggerMedium,
    triggerHeavy,
    triggerSuccess,
    triggerWarning,
    triggerError,
    triggerSelection,
  };
}
