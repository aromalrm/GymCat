import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { stackOptions } from "@/constants/theme";
import { useAuth } from "@/providers/auth-provider";

export default function OnboardingLayout() {
  const { ready, email, profile } = useAuth();

  if (!ready) {
    return (
      <View style={styles.screen}>
        <ActivityIndicator color="#FFFFFF" />
      </View>
    );
  }

  if (!email) return <Redirect href="/sign-in" />;
  if (profile) return <Redirect href="/(app)" />;

  return (
      <Stack screenOptions={{ ...stackOptions, title: "Your stats" }} />
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
