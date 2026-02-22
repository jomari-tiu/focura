import React from "react";
import { StyleSheet, View } from "react-native";
import { GlassCard } from "../ui/GlassCard";
import { Typography } from "../ui/Typography";
import { COLORS } from "../../constants/colors";
import { SPACING } from "../../constants/layout";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, subtitle, icon }: StatCardProps) {
  return (
    <GlassCard style={styles.card} padding={SPACING.md}>
      <View style={styles.row}>
        <View style={styles.textCol}>
          <Typography variant="muted">{label}</Typography>
          <Typography variant="h3" style={styles.value}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="muted" style={styles.subtitle}>
              {subtitle}
            </Typography>
          )}
        </View>
        {icon && <View style={styles.icon}>{icon}</View>}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textCol: {
    gap: 2,
  },
  value: {
    marginTop: 2,
  },
  subtitle: {
    marginTop: 2,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(124,58,237,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
});
