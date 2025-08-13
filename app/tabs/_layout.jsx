import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { Colors } from "../../lib/colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",
        headerShadowVisible: false,
        tabBarActiveTintColor: Colors.red,
        tabBarInactiveTintColor: Colors.muted,
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 12, fontWeight: "700", marginBottom: 6 },
        tabBarStyle: {
          position: "absolute",
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
          borderTopWidth: 0,
          backgroundColor: "#fff",
          marginHorizontal: 12,
          marginBottom: 12,
          borderRadius: 20,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="spotted"
        options={{
          title: "Spotted",
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: "Badges",
          tabBarIcon: ({ color, size }) => <Ionicons name="trophy-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
