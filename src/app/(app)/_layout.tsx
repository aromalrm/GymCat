import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { stackOptions } from "@/constants/theme";
import { useAuth } from "@/providers/auth-provider";

export default function AppLayout() {
  const { ready, email, profile } = useAuth();

  if (!ready) {
    return (
      <View style={styles.screen}>
        <ActivityIndicator color="#FFFFFF" />
      </View>
    );
  }

  if (!email) {
    return <Redirect href="/sign-in" />;
  }

  if (!profile) {
    return <Redirect href="/(onboarding)" />;
  }

  return (
      <Stack screenOptions={stackOptions}>
      <Stack.Screen name="index" options={{ title: "Calendar" }} />
      <Stack.Screen name="day/[date]" options={{ title: "Day" }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A0A0A",
  },
});
