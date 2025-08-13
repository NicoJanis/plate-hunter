import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { Colors } from "../lib/colors";
import "../lib/firebase";

export default function RootLayout() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors.red,
      background: Colors.background,
      card: "#fff",
      text: Colors.text,
      border: "#EAEAEA",
      notification: Colors.red,
    },
  };

  return (
    <ThemeProvider value={theme}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShadowVisible: false }}>
        {/* Tabs group */}
        <Stack.Screen name="tabs" options={{ headerShown: false }} />
        {/* State detail sits ON TOP of tabs; header shows back by default */}
        <Stack.Screen
          name="state/[id]"
          options={{
            title: "State",
            headerTitleAlign: "center",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
