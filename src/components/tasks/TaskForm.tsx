import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { BORDER_RADIUS, SPACING } from "../../constants/layout";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import { Button } from "../ui/Button";
import { useAppDispatch } from "../../context/AppContext";
import { ACTIONS } from "../../context/actions";
import { useHaptics } from "../../hooks/useHaptics";

interface TaskFormProps {
  onClose: () => void;
}

export function TaskForm({ onClose }: TaskFormProps) {
  const dispatch = useAppDispatch();
  const { triggerLight } = useHaptics();
  const [title, setTitle] = useState("");
  const [sessions, setSessions] = useState(4);

  const handleSubmit = () => {
    if (!title.trim()) return;
    triggerLight();
    dispatch({
      type: ACTIONS.TASK_ADD,
      payload: { title: title.trim(), estimatedSessions: sessions },
    });
    onClose();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>New Task</Text>

      <TextInput
        style={styles.input}
        placeholder="What are you working on?"
        placeholderTextColor={COLORS.text.muted}
        value={title}
        onChangeText={setTitle}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
        maxLength={80}
      />

      <View style={styles.sessionRow}>
        <Text style={styles.label}>Estimated sessions</Text>
        <View style={styles.counter}>
          <TouchableOpacity
            onPress={() => setSessions(Math.max(1, sessions - 1))}
            style={styles.counterBtn}
          >
            <Text style={styles.counterBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.counterValue}>{sessions}</Text>
          <TouchableOpacity
            onPress={() => setSessions(Math.min(20, sessions + 1))}
            style={styles.counterBtn}
          >
            <Text style={styles.counterBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Button
        label="Add Task"
        onPress={handleSubmit}
        disabled={!title.trim()}
        fullWidth
        size="lg"
        style={styles.submitBtn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  heading: {
    fontSize: FONT_SIZES["2xl"],
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    fontSize: FONT_SIZES.lg,
    color: COLORS.text.primary,
  },
  sessionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text.secondary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  counterBtn: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: "rgba(124,58,237,0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.4)",
  },
  counterBtnText: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.brand.purple,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 22,
  },
  counterValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    minWidth: 28,
    textAlign: "center",
  },
  submitBtn: {
    marginTop: SPACING.sm,
  },
});
