import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useAppDispatch } from "../src/context/AppContext";
import { ACTIONS } from "../src/context/actions";
import { COLORS } from "../src/constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../src/constants/typography";
import { SPACING, BORDER_RADIUS } from "../src/constants/layout";
import { Button } from "../src/components/ui/Button";
import { useNotifications } from "../src/hooks/useNotifications";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SLIDE_COUNT = 3;

interface Slide {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
  subtitle: string;
}

const SLIDES: Slide[] = [
  {
    icon: "timer-outline",
    iconColor: COLORS.brand.purple,
    title: "Deep Work,\nSimplified",
    subtitle:
      "Focura uses the Pomodoro technique to help you stay focused and make real progress every day.",
  },
  {
    icon: "checkmark-circle-outline",
    iconColor: COLORS.brand.blue,
    title: "Plan Your\nSessions",
    subtitle:
      "Break your work into tasks, estimate how many sessions they'll take, and watch your progress unfold.",
  },
  {
    icon: "bar-chart-outline",
    iconColor: COLORS.semantic.success,
    title: "Track Your\nStreak",
    subtitle:
      "Build momentum by seeing your daily focus stats, session streaks, and total time invested.",
  },
];

export default function OnboardingScreen() {
  const dispatch = useAppDispatch();
  const { requestPermissions } = useNotifications();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionLength, setSessionLength] = useState<25 | 50>(25);

  const translateX = useSharedValue(0);

  const goTo = (index: number) => {
    setCurrentIndex(index);
    translateX.value = withSpring(-index * SCREEN_WIDTH, {
      damping: 28,
      stiffness: 220,
    });
  };

  const handleNext = async () => {
    if (currentIndex < SLIDE_COUNT - 1) {
      goTo(currentIndex + 1);
    } else {
      // Final slide — request notifications and complete
      await requestPermissions();
      dispatch({ type: ACTIONS.ONBOARDING_COMPLETE });
      dispatch({ type: ACTIONS.TIMER_SET_DURATION, payload: sessionLength });
      router.replace("/(tabs)/");
    }
  };

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const isLast = currentIndex === SLIDE_COUNT - 1;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#0F0B1E", "#1A1040", "#0F0B1E"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.slidesContainer}>
        <Animated.View style={[styles.slidesTrack, containerStyle]}>
          {SLIDES.map((slide, i) => (
            <View key={i} style={[styles.slide]}>
              <View
                style={[
                  styles.iconCircle,
                  { borderColor: slide.iconColor + "40" },
                ]}
              >
                <View
                  style={[
                    styles.iconInner,
                    { backgroundColor: slide.iconColor + "20" },
                  ]}
                >
                  <Ionicons
                    name={slide.icon}
                    size={64}
                    color={slide.iconColor}
                  />
                </View>
              </View>

              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.subtitle}>{slide.subtitle}</Text>
              {i === 1 && (
                <View style={styles.sessionPicker}>
                  {([25, 50] as const).map((val) => (
                    <TouchableOpacity
                      key={val}
                      onPress={() => setSessionLength(val)}
                      style={[
                        styles.sessionCard,
                        sessionLength === val && styles.sessionCardActive,
                      ]}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.sessionCardTime}>{val}</Text>
                      <Text style={styles.sessionCardUnit}>min</Text>
                      {val === 25 && (
                        <Text style={styles.sessionCardHint}>Classic</Text>
                      )}
                      {val === 50 && (
                        <Text style={styles.sessionCardHint}>Deep Work</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {i === 2 && (
                <View style={styles.notifHint}>
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color={COLORS.text.muted}
                  />
                  <Text style={styles.notifText}>
                    We'll notify you when your session ends.
                  </Text>
                </View>
              )}
            </View>
          ))}
        </Animated.View>
      </View>

      <View style={styles.bottom}>
        <View style={styles.dots}>
          {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => goTo(i)}
              style={styles.dotWrapper}
            >
              <View
                style={[styles.dot, currentIndex === i && styles.dotActive]}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Button
          label={isLast ? "Get Started" : "Next"}
          onPress={handleNext}
          size="lg"
          fullWidth
          style={styles.nextBtn}
        />

        {currentIndex > 0 && (
          <TouchableOpacity
            onPress={() => goTo(currentIndex - 1)}
            style={styles.backBtn}
          >
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.dark.bg,
  },
  slidesContainer: {
    flex: 1,
    overflow: "hidden",
  },
  slidesTrack: {
    flex: 1,
    flexDirection: "row",
    width: SCREEN_WIDTH * SLIDE_COUNT,
  },
  slide: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.xl,
    gap: SPACING.lg,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  iconInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: FONT_SIZES["3xl"],
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.text.primary,
    textAlign: "center",
    lineHeight: 40,
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text.secondary,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 300,
  },
  sessionPicker: {
    flexDirection: "row",
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  sessionCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    gap: 4,
  },
  sessionCardActive: {
    borderColor: COLORS.brand.purple,
    backgroundColor: "rgba(124,58,237,0.15)",
  },
  sessionCardTime: {
    fontSize: FONT_SIZES["3xl"],
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
  },
  sessionCardUnit: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text.secondary,
  },
  sessionCardHint: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.muted,
    marginTop: 4,
  },
  notifHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  notifText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.muted,
    flex: 1,
  },
  bottom: {
    padding: SPACING.xl,
    paddingBottom: SPACING["3xl"],
    gap: SPACING.lg,
    alignItems: "center",
  },
  dots: {
    flexDirection: "row",
    gap: 8,
  },
  dotWrapper: {
    padding: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  dotActive: {
    backgroundColor: COLORS.brand.purple,
    width: 24,
  },
  nextBtn: {},
  backBtn: {
    paddingVertical: SPACING.sm,
  },
  backText: {
    color: COLORS.text.muted,
    fontSize: FONT_SIZES.base,
  },
});
