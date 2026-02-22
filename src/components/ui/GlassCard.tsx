import React from "react";
import { StyleSheet, View, Platform, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { COLORS } from "../../constants/colors";
import { BORDER_RADIUS } from "../../constants/layout";

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  padding?: number;
}

export function GlassCard({
  children,
  style,
  intensity = 60,
  padding = 16,
}: GlassCardProps) {
  return (
    <View style={[styles.container, style]}>
      {Platform.OS !== "web" ? (
        <BlurView
          intensity={intensity}
          tint="dark"
          experimentalBlurMethod={Platform.OS === "android" ? "dimezisBlurView" : undefined}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.webFallback]} />
      )}
      {/* Semi-transparent overlay */}
      <View style={[StyleSheet.absoluteFill, styles.overlay]} />
      {/* Content */}
      <View style={[styles.content, { padding }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.glass.border,
    backgroundColor: Platform.OS === "android" ? COLORS.glass.fallback : "transparent",
  },
  overlay: {
    backgroundColor: COLORS.glass.overlay,
  },
  webFallback: {
    backgroundColor: COLORS.glass.fallback,
  },
  content: {
    position: "relative",
  },
});
