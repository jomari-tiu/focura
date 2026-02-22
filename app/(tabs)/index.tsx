import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { GradientBackground } from "../../src/components/ui/GradientBackground";
import { GlassCard } from "../../src/components/ui/GlassCard";
import { ProgressBar } from "../../src/components/ui/ProgressBar";
import { CircularTimer } from "../../src/components/timer/CircularTimer";
import { TimerControls } from "../../src/components/timer/TimerControls";
import { SessionSelector } from "../../src/components/timer/SessionSelector";
import { BottomSheet } from "../../src/components/ui/BottomSheet";
import { TaskForm } from "../../src/components/tasks/TaskForm";
import { useTimer } from "../../src/hooks/useTimer";
import { useAppState, useAppDispatch } from "../../src/context/AppContext";
import { COLORS } from "../../src/constants/colors";
import { SPACING, TAB_BAR_HEIGHT } from "../../src/constants/layout";
import { FONT_SIZES, FONT_WEIGHTS } from "../../src/constants/typography";
import { ACTIONS } from "../../src/context/actions";

export default function HomeScreen() {
  const { start, pause, reset, timer } = useTimer();
  const { tasks, settings, todaySessionCount } = useAppState();
  const dispatch = useAppDispatch();
  const [showTaskForm, setShowTaskForm] = useState(false);

  const activeTask = tasks.find(
    (t) => t.id === timer.activeTaskId && t.status === "active"
  );
  const activeTasks = tasks.filter((t) => t.status === "active");

  const isRunning = timer.status === "running";
  const progress = timer.totalSeconds > 0 ? todaySessionCount / settings.dailyGoal : 0;

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Focus Session</Text>
              <Text style={styles.date}>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
          </View>

          {/* Active task card */}
          <GlassCard style={styles.taskCard} padding={SPACING.md}>
            <View style={styles.taskCardRow}>
              <View style={styles.taskInfo}>
                <Text style={styles.taskLabel}>Current Task</Text>
                <Text style={styles.taskTitle} numberOfLines={1}>
                  {activeTask ? activeTask.title : "No task selected"}
                </Text>
              </View>
              {!isRunning && (
                <TouchableOpacity
                  onPress={() => setShowTaskForm(true)}
                  style={styles.addTaskBtn}
                  hitSlop={8}
                >
                  <Ionicons name="add" size={20} color={COLORS.brand.purpleLight} />
                </TouchableOpacity>
              )}
            </View>

            {/* Task selector mini list */}
            {!isRunning && activeTasks.length > 0 && (
              <View style={styles.taskSelector}>
                {activeTasks.slice(0, 3).map((task) => (
                  <TouchableOpacity
                    key={task.id}
                    onPress={() =>
                      dispatch({ type: ACTIONS.TIMER_SET_TASK, payload: task.id })
                    }
                    style={[
                      styles.taskChip,
                      task.id === timer.activeTaskId && styles.taskChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.taskChipText,
                        task.id === timer.activeTaskId && styles.taskChipTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {task.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </GlassCard>

          {/* Circular Timer */}
          <View style={styles.timerWrapper}>
            <CircularTimer
              remainingSeconds={timer.remainingSeconds}
              totalSeconds={timer.totalSeconds}
              status={timer.status}
              label={activeTask?.title}
            />
          </View>

          {/* Timer Controls */}
          <TimerControls
            status={timer.status}
            onStart={start}
            onPause={pause}
            onReset={reset}
          />

          {/* Session Selector */}
          <View style={styles.sessionSelectorWrapper}>
            <SessionSelector
              selected={settings.defaultSessionLength}
              disabled={isRunning}
            />
          </View>

          {/* Daily Progress */}
          <GlassCard style={styles.progressCard} padding={SPACING.md}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Daily Goal</Text>
              <Text style={styles.progressCount}>
                <Text style={styles.progressHighlight}>{todaySessionCount}</Text>
                {" / "}
                {settings.dailyGoal} sessions
              </Text>
            </View>
            <ProgressBar progress={progress} height={8} style={styles.progressBar} />
          </GlassCard>
        </ScrollView>
      </SafeAreaView>

      {/* Add task bottom sheet */}
      <BottomSheet
        visible={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        snapHeight={360}
      >
        <TaskForm onClose={() => setShowTaskForm(false)} />
      </BottomSheet>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: TAB_BAR_HEIGHT + SPACING.lg,
    gap: SPACING.lg,
  },
  header: {
    paddingTop: SPACING.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: {
    fontSize: FONT_SIZES["2xl"],
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
  },
  date: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.muted,
    marginTop: 2,
  },
  taskCard: {},
  taskCardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  taskInfo: {
    flex: 1,
    gap: 2,
  },
  taskLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  taskTitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text.primary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  addTaskBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(124,58,237,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  taskSelector: {
    marginTop: SPACING.sm,
    gap: SPACING.xs,
  },
  taskChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  taskChipActive: {
    backgroundColor: "rgba(124,58,237,0.2)",
    borderColor: "rgba(124,58,237,0.5)",
  },
  taskChipText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.muted,
  },
  taskChipTextActive: {
    color: COLORS.brand.purpleLight,
    fontWeight: FONT_WEIGHTS.medium,
  },
  timerWrapper: {
    alignItems: "center",
    marginVertical: SPACING.sm,
  },
  sessionSelectorWrapper: {
    alignItems: "center",
  },
  progressCard: {},
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  progressLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  progressCount: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.muted,
  },
  progressHighlight: {
    color: COLORS.brand.purpleLight,
    fontWeight: FONT_WEIGHTS.bold,
  },
  progressBar: {},
});
