import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { CIRCUMFERENCE, RING_RADIUS, STROKE_WIDTH, SVG_CENTER, SVG_SIZE } from "../../constants/timer";
import { formatTime } from "../../utils/dateHelpers";
import { Typography } from "../ui/Typography";
import { COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import { Text } from "react-native";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularTimerProps {
  remainingSeconds: number;
  totalSeconds: number;
  status: "idle" | "running" | "paused" | "completed";
  label?: string;
}

export function CircularTimer({
  remainingSeconds,
  totalSeconds,
  status,
  label,
}: CircularTimerProps) {
  const progress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 1;
  const strokeOffset = useSharedValue(0); // 0 = full ring, CIRCUMFERENCE = empty

  useEffect(() => {
    const targetOffset = CIRCUMFERENCE * (1 - progress);
    strokeOffset.value = withTiming(targetOffset, {
      duration: 900,
      easing: Easing.linear,
    });
  }, [progress, strokeOffset]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: strokeOffset.value,
  }));

  const statusLabel =
    status === "running"
      ? "Focusing"
      : status === "paused"
      ? "Paused"
      : status === "completed"
      ? "Done!"
      : "Ready";

  return (
    <View style={styles.container}>
      <Svg
        width={SVG_SIZE}
        height={SVG_SIZE}
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
      >
        <Defs>
          <LinearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={COLORS.brand.purple} />
            <Stop offset="100%" stopColor={COLORS.brand.blue} />
          </LinearGradient>
        </Defs>

        {/* Track ring */}
        <Circle
          cx={SVG_CENTER}
          cy={SVG_CENTER}
          r={RING_RADIUS}
          stroke={COLORS.timer.track}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />

        {/* Progress ring */}
        <AnimatedCircle
          cx={SVG_CENTER}
          cy={SVG_CENTER}
          r={RING_RADIUS}
          stroke="url(#timerGradient)"
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeLinecap="round"
          animatedProps={animatedProps}
          rotation="-90"
          origin={`${SVG_CENTER},${SVG_CENTER}`}
        />
      </Svg>

      {/* Center content */}
      <View style={styles.center}>
        <Text style={styles.timeText}>{formatTime(remainingSeconds)}</Text>
        <Text style={styles.statusText}>{label || statusLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    fontSize: FONT_SIZES["4xl"],
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    letterSpacing: 2,
    fontVariant: ["tabular-nums"],
  },
  statusText: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text.secondary,
    marginTop: 4,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
