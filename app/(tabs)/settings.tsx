import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { GradientBackground } from "../../src/components/ui/GradientBackground";
import { GlassCard } from "../../src/components/ui/GlassCard";
import { SessionSelector } from "../../src/components/timer/SessionSelector";
import { useAppState, useAppDispatch } from "../../src/context/AppContext";
import { ACTIONS } from "../../src/context/actions";
import { COLORS } from "../../src/constants/colors";
import {
  SPACING,
  BORDER_RADIUS,
  TAB_BAR_HEIGHT,
} from "../../src/constants/layout";
import { FONT_SIZES, FONT_WEIGHTS } from "../../src/constants/typography";

interface SettingRowProps {
  label: string;
  subtitle?: string;
  children: React.ReactNode;
}

function SettingRow({ label, subtitle, children }: SettingRowProps) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.settingControl}>{children}</View>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

export default function SettingsScreen() {
  const { settings } = useAppState();
  const dispatch = useAppDispatch();

  const updateSetting = (key: string, value: unknown) => {
    dispatch({ type: ACTIONS.SETTINGS_UPDATE, payload: { [key]: value } });
  };

  const handleReset = () => {
    Alert.alert(
      "Reset All Data",
      "This will delete all your tasks, sessions, and stats. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => dispatch({ type: ACTIONS.RESET_ALL_DATA }),
        },
      ],
    );
  };

  const handleDailyGoalChange = (direction: "inc" | "dec") => {
    const current = settings.dailyGoal;
    if (direction === "inc") {
      updateSetting("dailyGoal", Math.min(current + 1, 20));
    } else {
      updateSetting("dailyGoal", Math.max(current - 1, 1));
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: TAB_BAR_HEIGHT + SPACING.lg },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
          </View>

          <SectionHeader title="Timer" />
          <GlassCard style={styles.card}>
            <SettingRow
              label="Session Length"
              subtitle="Duration of a focus session"
            >
              <SessionSelector selected={settings.defaultSessionLength} />
            </SettingRow>

            <View style={styles.divider} />

            <SettingRow label="Daily Goal" subtitle="Target sessions per day">
              <View style={styles.counter}>
                <TouchableOpacity
                  onPress={() => handleDailyGoalChange("dec")}
                  style={styles.counterBtn}
                >
                  <Text style={styles.counterBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{settings.dailyGoal}</Text>
                <TouchableOpacity
                  onPress={() => handleDailyGoalChange("inc")}
                  style={styles.counterBtn}
                >
                  <Text style={styles.counterBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </SettingRow>
          </GlassCard>

          <SectionHeader title="App" />
          <GlassCard style={styles.card}>
            <SettingRow
              label="Notifications"
              subtitle="Alert when session ends"
            >
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={(v) => updateSetting("notificationsEnabled", v)}
                trackColor={{
                  false: "rgba(255,255,255,0.1)",
                  true: COLORS.brand.purple,
                }}
                thumbColor="#FFFFFF"
              />
            </SettingRow>

            <View style={styles.divider} />

            <SettingRow label="Theme" subtitle="Light or dark mode">
              <View style={styles.themeToggle}>
                {(["dark", "light"] as const).map((mode) => (
                  <TouchableOpacity
                    key={mode}
                    onPress={() => updateSetting("themeMode", mode)}
                    style={[
                      styles.themePill,
                      settings.themeMode === mode && styles.themePillActive,
                    ]}
                  >
                    <Ionicons
                      name={mode === "dark" ? "moon" : "sunny"}
                      size={14}
                      color={
                        settings.themeMode === mode
                          ? COLORS.text.primary
                          : COLORS.text.muted
                      }
                    />
                    <Text
                      style={[
                        styles.themePillText,
                        settings.themeMode === mode &&
                          styles.themePillTextActive,
                      ]}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </SettingRow>
          </GlassCard>

          {/* Danger Zone */}
          <SectionHeader title="Data" />
          <GlassCard style={styles.card}>
            <TouchableOpacity
              onPress={handleReset}
              style={styles.dangerRow}
              activeOpacity={0.7}
            >
              <Ionicons
                name="trash-outline"
                size={20}
                color={COLORS.semantic.error}
              />
              <View style={styles.dangerInfo}>
                <Text style={styles.dangerLabel}>Reset All Data</Text>
                <Text style={styles.dangerSubtitle}>
                  Delete all tasks, sessions, and stats
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={COLORS.text.muted}
              />
            </TouchableOpacity>
          </GlassCard>

          {/* Version */}
          <Text style={styles.version}>Focura v1.0.0</Text>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  header: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZES["2xl"],
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
  },
  sectionHeader: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.muted,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: -SPACING.xs,
    marginTop: SPACING.xs,
  },
  card: {},
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
    gap: SPACING.md,
  },
  settingInfo: {
    flex: 1,
    gap: 2,
  },
  settingLabel: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text.primary,
  },
  settingSubtitle: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.muted,
  },
  settingControl: {
    alignItems: "flex-end",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginVertical: SPACING.xs,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: "rgba(124,58,237,0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.4)",
  },
  counterBtnText: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.brand.purple,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 22,
  },
  counterValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    minWidth: 24,
    textAlign: "center",
  },
  themeToggle: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: BORDER_RADIUS.full,
    padding: 2,
  },
  themePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
  },
  themePillActive: {
    backgroundColor: COLORS.brand.purple,
  },
  themePillText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.muted,
    fontWeight: FONT_WEIGHTS.medium,
  },
  themePillTextActive: {
    color: COLORS.text.primary,
  },
  dangerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  dangerInfo: {
    flex: 1,
    gap: 2,
  },
  dangerLabel: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.semantic.error,
  },
  dangerSubtitle: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.muted,
  },
  version: {
    textAlign: "center",
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.muted,
    marginTop: SPACING.sm,
  },
});
