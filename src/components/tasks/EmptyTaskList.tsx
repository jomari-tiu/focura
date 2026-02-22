import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Typography } from "../ui/Typography";
import { COLORS } from "../../constants/colors";
import { SPACING } from "../../constants/layout";

export function EmptyTaskList() {
  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle-outline" size={64} color={COLORS.text.muted} />
      <Typography variant="h4" align="center" style={styles.title}>
        No tasks yet
      </Typography>
      <Typography variant="body" align="center" color={COLORS.text.muted}>
        Add a task to start tracking your focus sessions.
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
    paddingBottom: 100,
  },
  title: {
    marginTop: SPACING.md,
  },
});
