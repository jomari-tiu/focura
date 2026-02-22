import { useAppState } from "../context/AppContext";
import { COLORS } from "../constants/colors";

export function useTheme() {
  const { settings } = useAppState();
  const isDark = settings.themeMode === "dark";

  return {
    isDark,
    colors: {
      bg: isDark ? COLORS.dark.bg : COLORS.light.bg,
      surface: isDark ? COLORS.dark.surface : COLORS.light.surface,
      card: isDark ? COLORS.dark.card : COLORS.light.card,
      textPrimary: isDark ? COLORS.text.primary : COLORS.text.dark,
      textSecondary: isDark ? COLORS.text.secondary : "rgba(26,16,64,0.6)",
      textMuted: isDark ? COLORS.text.muted : "rgba(26,16,64,0.4)",
      brand: COLORS.brand,
      glass: COLORS.glass,
    },
  };
}
