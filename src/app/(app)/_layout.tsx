import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { AppShell } from "@/components/app-shell";
import { colors, stackOptions } from "@/constants/theme";
import { useAuth } from "@/providers/auth-provider";

export default function AppLayout() {
  const { ready, email, profile } = useAuth();

  if (!ready) {
    return (
      <View style={styles.screen}>
        <ActivityIndicator color={colors.volt} />
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
    <AppShell>
      <Stack screenOptions={{ ...stackOptions, headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="day/[date]" />
      </Stack>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.canvas,
  },
});
