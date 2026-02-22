import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/colors";
import { BORDER_RADIUS } from "../../constants/layout";

interface TimerControlsProps {
  status: "idle" | "running" | "paused" | "completed";
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function TimerControls({ status, onStart, onPause, onReset }: TimerControlsProps) {
  const isRunning = status === "running";

  return (
    <View style={styles.container}>
      {/* Reset button */}
      <TouchableOpacity
        onPress={onReset}
        style={styles.secondaryButton}
        activeOpacity={0.7}
        disabled={status === "idle"}
      >
        <Ionicons
          name="refresh"
          size={22}
          color={status === "idle" ? "rgba(255,255,255,0.3)" : COLORS.text.secondary}
        />
      </TouchableOpacity>

      {/* Primary play/pause */}
      <TouchableOpacity
        onPress={isRunning ? onPause : onStart}
        activeOpacity={0.85}
        style={styles.primaryWrapper}
      >
        <LinearGradient
          colors={[COLORS.brand.purple, COLORS.brand.blue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.primaryButton}
        >
          <Ionicons
            name={isRunning ? "pause" : "play"}
            size={32}
            color="#FFFFFF"
            style={isRunning ? undefined : styles.playOffset}
          />
        </LinearGradient>
      </TouchableOpacity>

      {/* Placeholder to balance layout */}
      <View style={styles.secondaryButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  primaryWrapper: {
    shadowColor: COLORS.brand.purple,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButton: {
    width: 76,
    height: 76,
    borderRadius: BORDER_RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  playOffset: {
    marginLeft: 4,
  },
});
