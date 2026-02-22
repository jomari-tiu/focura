import { Tabs } from "expo-router";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../src/constants/colors";
import { TAB_BAR_HEIGHT } from "../../src/constants/layout";

function TabBarBackground() {
  if (Platform.OS === "web") {
    return <View style={[StyleSheet.absoluteFill, styles.webTabBg]} />;
  }
  return (
    <BlurView
      intensity={80}
      tint="dark"
      style={StyleSheet.absoluteFill}
      experimentalBlurMethod={Platform.OS === "android" ? "dimezisBlurView" : undefined}
    />
  );
}

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

interface TabConfig {
  name: string;
  title: string;
  icon: IoniconsName;
  iconFocused: IoniconsName;
}

const TABS: TabConfig[] = [
  {
    name: "index",
    title: "Focus",
    icon: "timer-outline",
    iconFocused: "timer",
  },
  {
    name: "tasks",
    title: "Tasks",
    icon: "checkmark-circle-outline",
    iconFocused: "checkmark-circle",
  },
  {
    name: "stats",
    title: "Stats",
    icon: "bar-chart-outline",
    iconFocused: "bar-chart",
  },
  {
    name: "settings",
    title: "Settings",
    icon: "settings-outline",
    iconFocused: "settings",
  },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.brand.purple,
        tabBarInactiveTintColor: "rgba(255,255,255,0.4)",
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => <TabBarBackground />,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? tab.iconFocused : tab.icon}
                size={24}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    borderTopWidth: 0,
    borderTopColor: "transparent",
    elevation: 0,
    height: TAB_BAR_HEIGHT,
    backgroundColor: "transparent",
    paddingBottom: Platform.OS === "ios" ? 20 : 8,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: "500",
  },
  webTabBg: {
    backgroundColor: "rgba(15, 11, 30, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
});
