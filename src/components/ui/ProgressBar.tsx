import React, { useEffect } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { COLORS } from "../../constants/colors";
import { BORDER_RADIUS } from "../../constants/layout";

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  style?: ViewStyle;
  color?: string;
}

export function ProgressBar({
  progress,
  height = 6,
  style,
  color = COLORS.brand.purple,
}: ProgressBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(Math.min(Math.max(progress, 0), 1), {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, width]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View style={[styles.track, { height }, style]}>
      <Animated.View style={[styles.fill, { backgroundColor: color, height }, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: BORDER_RADIUS.full,
    overflow: "hidden",
    width: "100%",
  },
  fill: {
    borderRadius: BORDER_RADIUS.full,
  },
});
