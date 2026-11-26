import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useAuth } from "@/providers/auth-provider";

export default function Index() {
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

  return <Redirect href="/sign-in" />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A0A0A",
  },
});
