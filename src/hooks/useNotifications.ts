import * as Notifications from "expo-notifications";
import { useCallback, useEffect } from "react";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications() {
  useEffect(() => {
    // Request permissions on mount (called from onboarding)
  }, []);

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === "web") return false;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  }, []);

  const sendCompletionNotification = useCallback(async () => {
    if (Platform.OS === "web") return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Focus session complete! 🎉",
        body: "Great work! Take a short break before the next session.",
        sound: true,
      },
      trigger: null, // Fire immediately
    });
  }, []);

  return { requestPermissions, sendCompletionNotification };
}
