import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { GlassCard } from "../ui/GlassCard";
import { Typography } from "../ui/Typography";
import { COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import { SPACING } from "../../constants/layout";

interface StreakBadgeProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakBadge({ currentStreak, longestStreak }: StreakBadgeProps) {
  return (
    <GlassCard padding={SPACING.lg}>
      <View style={styles.container}>
        <View style={styles.main}>
          <Text style={styles.fire}>🔥</Text>
          <View>
            <Typography variant="muted">Current Streak</Typography>
            <Text style={styles.count}>
              {currentStreak} <Text style={styles.unit}>day{currentStreak !== 1 ? "s" : ""}</Text>
            </Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.best}>
          <Typography variant="muted">Best</Typography>
          <Typography variant="h4" color={COLORS.brand.purpleLight}>
            {longestStreak}d
          </Typography>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  main: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    flex: 1,
  },
  fire: {
    fontSize: 40,
  },
  count: {
    fontSize: FONT_SIZES["3xl"],
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginTop: 2,
  },
  unit: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.text.secondary,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginHorizontal: SPACING.lg,
  },
  best: {
    alignItems: "center",
    gap: 2,
  },
});
