import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useAuth } from "@/providers/auth-provider";

export default function AuthLayout() {
  const { ready, email, profile } = useAuth();

  if (!ready) {
    return (
      <View style={styles.screen}>
        <ActivityIndicator color="#FFFFFF" />
      </View>
    );
  }

  if (email) {
    return <Redirect href={profile ? "/(app)" : "/(onboarding)"} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
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
