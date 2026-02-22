import React, { useCallback } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Task } from "../../types";
import { COLORS } from "../../constants/colors";
import { BORDER_RADIUS, SPACING } from "../../constants/layout";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import { useAppDispatch } from "../../context/AppContext";
import { ACTIONS } from "../../context/actions";
import { useHaptics } from "../../hooks/useHaptics";

interface TaskItemProps {
  task: Task;
  onLongPress: () => void;
  isActive: boolean;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

const SWIPE_THRESHOLD = -120;
const DELETE_ZONE_WIDTH = 80;

export function TaskItem({
  task,
  onLongPress,
  isActive,
  onSelect,
  isSelected = false,
}: TaskItemProps) {
  const dispatch = useAppDispatch();
  const { triggerWarning } = useHaptics();
  const translateX = useSharedValue(0);
  const deleteOpacity = useSharedValue(0);

  const handleDelete = useCallback(() => {
    dispatch({ type: ACTIONS.TASK_DELETE, payload: task.id });
  }, [dispatch, task.id]);

  const handleComplete = useCallback(() => {
    dispatch({ type: ACTIONS.TASK_COMPLETE, payload: task.id });
  }, [dispatch, task.id]);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      if (e.translationX < 0) {
        translateX.value = Math.max(e.translationX, -DELETE_ZONE_WIDTH * 1.5);
        deleteOpacity.value = Math.min(Math.abs(e.translationX) / DELETE_ZONE_WIDTH, 1);
      }
    })
    .onEnd((e) => {
      if (e.translationX < SWIPE_THRESHOLD) {
        runOnJS(triggerWarning)();
        runOnJS(handleDelete)();
      }
      translateX.value = withSpring(0, { damping: 25, stiffness: 300 });
      deleteOpacity.value = withTiming(0, { duration: 200 });
    });

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const deleteStyle = useAnimatedStyle(() => ({
    opacity: deleteOpacity.value,
  }));

  const completionFraction = task.estimatedSessions > 0
    ? task.completedSessions / task.estimatedSessions
    : 0;

  return (
    <View style={[styles.wrapper, isActive && styles.activeWrapper]}>
      {/* Delete reveal */}
      <Animated.View style={[styles.deleteArea, deleteStyle]}>
        <Ionicons name="trash" size={22} color="#FFFFFF" />
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.container, rowStyle, isSelected && styles.selectedContainer]}>
          {/* Checkbox */}
          <TouchableOpacity
            onPress={handleComplete}
            style={styles.checkbox}
            hitSlop={8}
          >
            {task.status === "completed" ? (
              <Ionicons name="checkmark-circle" size={24} color={COLORS.brand.purple} />
            ) : (
              <Ionicons name="ellipse-outline" size={24} color={COLORS.text.muted} />
            )}
          </TouchableOpacity>

          {/* Content */}
          <TouchableOpacity
            style={styles.content}
            onPress={() => onSelect?.(task.id)}
            onLongPress={onLongPress}
            delayLongPress={200}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.title,
                task.status === "completed" && styles.completedTitle,
              ]}
              numberOfLines={2}
            >
              {task.title}
            </Text>
            <View style={styles.meta}>
              <View style={styles.sessionBadge}>
                <Ionicons name="timer-outline" size={12} color={COLORS.brand.purpleLight} />
                <Text style={styles.sessionText}>
                  {task.completedSessions}/{task.estimatedSessions}
                </Text>
              </View>

              {/* Mini progress bar */}
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.min(completionFraction, 1) * 100}%` },
                  ]}
                />
              </View>
            </View>
          </TouchableOpacity>

          {/* Drag handle */}
          <TouchableOpacity
            onLongPress={onLongPress}
            delayLongPress={100}
            hitSlop={8}
            style={styles.dragHandle}
          >
            <Ionicons name="reorder-two" size={20} color={COLORS.text.muted} />
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  activeWrapper: {
    shadowColor: COLORS.brand.purple,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
    zIndex: 999,
  },
  deleteArea: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: DELETE_ZONE_WIDTH,
    backgroundColor: COLORS.semantic.error,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.dark.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: SPACING.sm,
  },
  selectedContainer: {
    borderColor: COLORS.brand.purple,
    backgroundColor: "rgba(124,58,237,0.1)",
  },
  checkbox: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text.primary,
  },
  completedTitle: {
    textDecorationLine: "line-through",
    color: COLORS.text.muted,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  sessionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  sessionText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.brand.purpleLight,
    fontWeight: FONT_WEIGHTS.medium,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.brand.purple,
    borderRadius: 2,
  },
  dragHandle: {
    paddingHorizontal: 4,
  },
});
