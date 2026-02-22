import React from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { GradientBackground } from "../../src/components/ui/GradientBackground";
import { GlassCard } from "../../src/components/ui/GlassCard";
import { BarChart } from "../../src/components/stats/BarChart";
import { StatCard } from "../../src/components/stats/StatCard";
import { StreakBadge } from "../../src/components/stats/StreakBadge";
import { useAppState } from "../../src/context/AppContext";
import {
  getLast7Days,
  getTotalFocusMinutes,
  getTotalSessions,
  getCompletionRate,
} from "../../src/utils/statsCalculator";
import { COLORS } from "../../src/constants/colors";
import { SPACING, TAB_BAR_HEIGHT } from "../../src/constants/layout";
import { FONT_SIZES, FONT_WEIGHTS } from "../../src/constants/typography";

export default function StatsScreen() {
  const { sessions, dailyStats, streak, tasks } = useAppState();

  const last7Days = getLast7Days(dailyStats);
  const totalMinutes = getTotalFocusMinutes(dailyStats);
  const totalSessions = getTotalSessions(sessions);
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMins = totalMinutes % 60;

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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Stats</Text>
          </View>

          {/* Streak */}
          <StreakBadge
            currentStreak={streak.currentStreak}
            longestStreak={streak.longestStreak}
          />

          {/* Weekly chart */}
          <GlassCard>
            <Text style={styles.sectionTitle}>Last 7 Days</Text>
            <BarChart data={last7Days} />
          </GlassCard>

          {/* Stats grid */}
          <View style={styles.statsGrid}>
            <StatCard
              label="Total Sessions"
              value={totalSessions}
              subtitle="completed"
              icon={<Ionicons name="timer" size={20} color={COLORS.brand.purple} />}
            />
            <StatCard
              label="Focus Time"
              value={totalHours > 0 ? `${totalHours}h ${remainingMins}m` : `${totalMinutes}m`}
              subtitle="total"
              icon={<Ionicons name="flame" size={20} color={COLORS.brand.blue} />}
            />
          </View>

          <View style={styles.statsGrid}>
            <StatCard
              label="Tasks Done"
              value={completedTasks}
              subtitle="completed"
              icon={<Ionicons name="checkmark-circle" size={20} color={COLORS.semantic.success} />}
            />
            <StatCard
              label="Best Streak"
              value={`${streak.longestStreak}d`}
              subtitle="days in a row"
              icon={<Ionicons name="trophy" size={20} color={COLORS.semantic.warning} />}
            />
          </View>
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
  sectionTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.secondary,
    padding: SPACING.md,
    paddingBottom: 0,
  },
  statsGrid: {
    flexDirection: "row",
    gap: SPACING.md,
  },
});
