/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#7C3AED",
          indigo: "#4F46E5",
          blue: "#2563EB",
          light: "#A78BFA",
        },
        dark: {
          bg: "#0F0B1E",
          surface: "#1A1040",
          card: "#211850",
          border: "rgba(255,255,255,0.12)",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "rgba(255,255,255,0.7)",
          muted: "rgba(255,255,255,0.4)",
        },
      },
    },
  },
  plugins: [],
};
