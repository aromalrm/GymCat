import { Stack } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import "../global.css";

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS !== "web") return;
    const id = "gymcat-inter";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    document.title = "GymCat";
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#F7F6F2" },
        animation: "fade",
      }}
    />
  );
}
