import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1F6F78",
        tabBarInactiveTintColor: "#78716C",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginBottom: Platform.OS === "ios" ? 0 : 4,
        },
        tabBarStyle: {
          backgroundColor: "#FFFCF9",
          borderTopColor: "#E7E5E4",
          borderTopWidth: 0.5,
          height: Platform.OS === "ios" ? 88 : 64,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="receipts"
        options={{
          title: t("tabs.receipts"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
