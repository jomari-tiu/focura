import React from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { COLORS } from "../../constants/colors";
import { WeeklyDataPoint } from "../../utils/statsCalculator";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import { SPACING } from "../../constants/layout";

interface BarChartProps {
  data: WeeklyDataPoint[];
  maxValue?: number;
}

const CHART_HEIGHT = 160;

export function BarChart({ data, maxValue }: BarChartProps) {
  const max = maxValue ?? Math.max(...data.map((d) => d.sessionsCompleted), 1);

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {data.map((item) => {
          const fraction = max > 0 ? item.sessionsCompleted / max : 0;
          const barHeight = Math.max(fraction * CHART_HEIGHT, 4);

          return (
            <View key={item.date} style={styles.barCol}>
              <Text style={styles.barValue}>
                {item.sessionsCompleted > 0 ? item.sessionsCompleted : ""}
              </Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor:
                        fraction > 0.5 ? COLORS.brand.purple : "rgba(124,58,237,0.4)",
                    },
                  ]}
                />
              </View>
              <Text style={styles.dayLabel}>{item.dayLabel}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: CHART_HEIGHT + 48, // + label space
    paddingHorizontal: SPACING.xs,
  },
  barCol: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  barValue: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.muted,
    height: 16,
    textAlign: "center",
  },
  barTrack: {
    width: "60%",
    height: CHART_HEIGHT,
    justifyContent: "flex-end",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 6,
    overflow: "hidden",
  },
  bar: {
    width: "100%",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  dayLabel: {
    fontSize: FONT_SIZES.xs,
    color: "rgba(255,255,255,0.5)",
    fontWeight: FONT_WEIGHTS.medium,
    marginTop: 4,
  },
});
