import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/colors";
import { BORDER_RADIUS, SPACING } from "../../constants/layout";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  onPress: () => void;
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const sizeStyles: Record<ButtonSize, { paddingH: number; paddingV: number; fontSize: number }> = {
  sm: { paddingH: 16, paddingV: 8, fontSize: FONT_SIZES.sm },
  md: { paddingH: 24, paddingV: 12, fontSize: FONT_SIZES.base },
  lg: { paddingH: 32, paddingV: 16, fontSize: FONT_SIZES.lg },
};

export function Button({
  onPress,
  label,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const sizeStyle = sizeStyles[size];

  if (variant === "primary") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[fullWidth && styles.fullWidth, style]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[COLORS.brand.purple, COLORS.brand.blue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.base,
            {
              paddingHorizontal: sizeStyle.paddingH,
              paddingVertical: sizeStyle.paddingV,
            },
            disabled && styles.disabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text
              style={[
                styles.text,
                { fontSize: sizeStyle.fontSize },
                textStyle,
              ]}
            >
              {label}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const variantStyles: Record<Exclude<ButtonVariant, "primary">, ViewStyle> = {
    secondary: styles.secondary,
    ghost: styles.ghost,
    danger: styles.danger,
  };

  const variantTextColors: Record<Exclude<ButtonVariant, "primary">, string> = {
    secondary: COLORS.text.primary,
    ghost: COLORS.text.secondary,
    danger: "#FFFFFF",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        variantStyles[variant as Exclude<ButtonVariant, "primary">],
        {
          paddingHorizontal: sizeStyle.paddingH,
          paddingVertical: sizeStyle.paddingV,
        },
        disabled && styles.disabled,
        fullWidth && styles.fullWidth,
        style,
      ]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            { fontSize: sizeStyle.fontSize, color: variantTextColors[variant as Exclude<ButtonVariant, "primary">] },
            textStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BORDER_RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  secondary: {
    backgroundColor: "rgba(124,58,237,0.2)",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.5)",
  },
  ghost: {
    backgroundColor: "transparent",
  },
  danger: {
    backgroundColor: COLORS.semantic.error,
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    alignSelf: "stretch",
  },
  text: {
    color: COLORS.text.primary,
    fontWeight: FONT_WEIGHTS.semibold,
    letterSpacing: 0.3,
  },
});
