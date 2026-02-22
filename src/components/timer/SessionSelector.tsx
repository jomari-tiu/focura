import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { COLORS } from "../../constants/colors";
import { BORDER_RADIUS } from "../../constants/layout";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import { useAppDispatch } from "../../context/AppContext";
import { ACTIONS } from "../../context/actions";
import { useHaptics } from "../../hooks/useHaptics";

interface SessionSelectorProps {
  selected: 25 | 50;
  disabled?: boolean;
}

export function SessionSelector({ selected, disabled = false }: SessionSelectorProps) {
  const dispatch = useAppDispatch();
  const { triggerSelection } = useHaptics();

  const select = (value: 25 | 50) => {
    if (disabled || value === selected) return;
    triggerSelection();
    dispatch({ type: ACTIONS.TIMER_SET_DURATION, payload: value });
  };

  return (
    <View style={styles.container}>
      {([25, 50] as const).map((val) => {
        const isActive = selected === val;
        return (
          <TouchableOpacity
            key={val}
            onPress={() => select(val)}
            disabled={disabled}
            style={[styles.pill, isActive && styles.pillActive]}
            activeOpacity={0.7}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {val} min
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: BORDER_RADIUS.full,
    padding: 3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full,
  },
  pillActive: {
    backgroundColor: COLORS.brand.purple,
    shadowColor: COLORS.brand.purple,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text.muted,
  },
  labelActive: {
    color: COLORS.text.primary,
    fontWeight: FONT_WEIGHTS.semibold,
  },
});
