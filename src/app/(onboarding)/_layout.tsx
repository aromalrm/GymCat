import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useAuth } from "@/providers/auth-provider";

export default function OnboardingLayout() {
  const { ready, email, profile } = useAuth();

  if (!ready) {
    return (
      <View style={styles.screen}>
        <ActivityIndicator color="#F2C14E" />
      </View>
    );
  }

  if (!email) return <Redirect href="/sign-in" />;
  if (profile) return <Redirect href="/(app)" />;

  return (
    <Stack
      screenOptions={{
        title: "Your stats",
        headerStyle: { backgroundColor: "#14110E" },
        headerTintColor: "#F7F1E8",
        contentStyle: { backgroundColor: "#14110E" },
      }}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#14110E",
  },
});
