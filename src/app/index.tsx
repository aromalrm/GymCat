import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useAuth } from "@/providers/auth-provider";

export default function Index() {
  const { ready, email } = useAuth();

  if (!ready) {
    return (
      <View style={styles.screen}>
        <ActivityIndicator color="#F2C14E" />
      </View>
    );
  }

  if (email) {
    return <Redirect href="/(app)" />;
  }

  return <Redirect href="/sign-in" />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#14110E",
  },
});
