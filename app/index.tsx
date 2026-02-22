import { Redirect } from "expo-router";
import { useAppState } from "../src/context/AppContext";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { COLORS } from "../src/constants/colors";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../src/utils/storageKeys";

export default function IndexScreen() {
  const [ready, setReady] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.APP_STATE);
        if (raw) {
          const parsed = JSON.parse(raw);
          setHasOnboarded(!!parsed.hasCompletedOnboarding);
        }
      } catch {
        // ignore
      } finally {
        setReady(true);
      }
    }
    check();
  }, []);

  if (!ready) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={COLORS.brand.purple} />
      </View>
    );
  }

  if (hasOnboarded) {
    return <Redirect href="/(tabs)/" />;
  }
  return <Redirect href="/onboarding" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark.bg,
    alignItems: "center",
    justifyContent: "center",
  },
});
