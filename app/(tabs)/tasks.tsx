import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { Ionicons } from "@expo/vector-icons";
import { GradientBackground } from "../../src/components/ui/GradientBackground";
import { TaskItem } from "../../src/components/tasks/TaskItem";
import { EmptyTaskList } from "../../src/components/tasks/EmptyTaskList";
import { BottomSheet } from "../../src/components/ui/BottomSheet";
import { TaskForm } from "../../src/components/tasks/TaskForm";
import { useAppState, useAppDispatch } from "../../src/context/AppContext";
import { ACTIONS } from "../../src/context/actions";
import { Task } from "../../src/types";
import { COLORS } from "../../src/constants/colors";
import { SPACING, BORDER_RADIUS, TAB_BAR_HEIGHT } from "../../src/constants/layout";
import { FONT_SIZES, FONT_WEIGHTS } from "../../src/constants/typography";

type TabFilter = "active" | "completed";

export default function TasksScreen() {
  const { tasks, timer } = useAppState();
  const dispatch = useAppDispatch();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<TabFilter>("active");

  const filteredTasks = tasks
    .filter((t) => (filter === "active" ? t.status === "active" : t.status === "completed"))
    .sort((a, b) => a.order - b.order);

  const handleDragEnd = ({ data }: { data: Task[] }) => {
    dispatch({ type: ACTIONS.TASK_REORDER, payload: data });
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Task>) => (
    <ScaleDecorator>
      <TaskItem
        task={item}
        onLongPress={drag}
        isActive={isActive}
        isSelected={item.id === timer.activeTaskId}
        onSelect={(id) =>
          dispatch({ type: ACTIONS.TIMER_SET_TASK, payload: id })
        }
      />
    </ScaleDecorator>
  );

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Tasks</Text>
          <TouchableOpacity
            onPress={() => setShowForm(true)}
            style={styles.addBtn}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Filter tabs */}
        <View style={styles.filterBar}>
          {(["active", "completed"] as TabFilter[]).map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.filterTab, filter === f && styles.filterTabActive]}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Task list */}
        {filteredTasks.length === 0 ? (
          <EmptyTaskList />
        ) : (
          <DraggableFlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            onDragEnd={handleDragEnd}
            renderItem={renderItem}
            activationDistance={10}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: TAB_BAR_HEIGHT + SPACING.lg },
            ]}
          />
        )}
      </SafeAreaView>

      <BottomSheet
        visible={showForm}
        onClose={() => setShowForm(false)}
        snapHeight={360}
      >
        <TaskForm onClose={() => setShowForm(false)} />
      </BottomSheet>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES["2xl"],
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.brand.purple,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.brand.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  filterBar: {
    flexDirection: "row",
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: BORDER_RADIUS.full,
    padding: 3,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full,
    alignItems: "center",
  },
  filterTabActive: {
    backgroundColor: COLORS.brand.purple,
  },
  filterText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.muted,
    fontWeight: FONT_WEIGHTS.medium,
  },
  filterTextActive: {
    color: COLORS.text.primary,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  listContent: {
    paddingTop: SPACING.xs,
  },
});
