import React from "react";
import { Text, StyleSheet, TextStyle } from "react-native";
import { COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";

type TypographyVariant = "h1" | "h2" | "h3" | "h4" | "body" | "bodyLarge" | "caption" | "muted";

interface TypographyProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
  style?: TextStyle;
  color?: string;
  align?: "left" | "center" | "right";
  numberOfLines?: number;
}

export function Typography({
  variant = "body",
  children,
  style,
  color,
  align,
  numberOfLines,
}: TypographyProps) {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        styles[variant],
        color ? { color } : undefined,
        align ? { textAlign: align } : undefined,
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create<Record<TypographyVariant, TextStyle>>({
  h1: {
    fontSize: FONT_SIZES["4xl"],
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.text.primary,
    letterSpacing: -1,
  },
  h2: {
    fontSize: FONT_SIZES["3xl"],
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    letterSpacing: -0.5,
  },
  h3: {
    fontSize: FONT_SIZES["2xl"],
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
  },
  h4: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
  },
  bodyLarge: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.text.secondary,
    lineHeight: 26,
  },
  body: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.text.secondary,
    lineHeight: 22,
  },
  caption: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text.secondary,
  },
  muted: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.text.muted,
  },
});
