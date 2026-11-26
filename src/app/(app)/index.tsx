import { Pressable, StyleSheet, Text, View } from "react-native";

import { EXERCISE_DEMO_SOURCE_URL } from "@/constants/demo-video";
import { useAuth } from "@/providers/auth-provider";

export default function HomeScreen() {
  const { email, mode, signOut } = useAuth();

  return (
    <View style={styles.screen}>
      <Text style={styles.heading}>You are signed in</Text>
      <Text style={styles.body}>{email}</Text>
      <Text style={styles.body}>
        {mode === "supabase"
          ? "Session is stored with Supabase."
          : "Local fallback only. This account is not on Supabase."}
      </Text>
      <Text style={styles.note}>
        Onboarding, the calendar, logging, and the video player are later
        milestones. Seeded exercise videos point at {EXERCISE_DEMO_SOURCE_URL}{" "}
        until each row has its own file URL.
      </Text>
      <Pressable
        accessibilityRole="button"
        style={styles.button}
        onPress={() => {
          void signOut();
        }}
      >
        <Text style={styles.buttonLabel}>Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 24,
    gap: 12,
    backgroundColor: "#14110E",
  },
  heading: {
    color: "#F7F1E8",
    fontSize: 28,
    fontWeight: "700",
  },
  body: {
    color: "#E7D7B8",
    fontSize: 16,
  },
  note: {
    color: "#B7AA9A",
    lineHeight: 22,
  },
  button: {
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: "#2A241C",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buttonLabel: {
    color: "#F7F1E8",
    fontWeight: "600",
  },
});
