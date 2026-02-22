export const COLORS = {
  brand: {
    purple: "#7C3AED",
    purpleLight: "#A78BFA",
    indigo: "#4F46E5",
    blue: "#2563EB",
    gradient: ["#7C3AED", "#2563EB"] as string[],
  },
  dark: {
    bg: "#0F0B1E",
    surface: "#1A1040",
    card: "#211850",
    cardAlt: "#160D3D",
  },
  light: {
    bg: "#F5F3FF",
    surface: "#EDE9FE",
    card: "#FFFFFF",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "rgba(255,255,255,0.7)",
    muted: "rgba(255,255,255,0.4)",
    dark: "#1A1040",
  },
  semantic: {
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
  },
  glass: {
    border: "rgba(255,255,255,0.12)",
    overlay: "rgba(255,255,255,0.07)",
    fallback: "rgba(26,21,53,0.85)",
  },
  timer: {
    ring: ["#7C3AED", "#2563EB"] as string[],
    track: "rgba(255,255,255,0.08)",
  },
} as const;
