import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { PressableScale } from "@/components/pressable-scale";
import { useAuth } from "@/providers/auth-provider";

type Props = {
  mode: "sign-in" | "sign-up";
};

export function AuthForm({ mode }: Props) {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const title = mode === "sign-in" ? "Log in" : "Create account";

  async function submit() {
    setBusy(true);
    setMessage(null);
    const error =
      mode === "sign-in"
        ? await auth.signIn(email, password)
        : await auth.signUp(email, password);
    setMessage(error);
    setBusy(false);
  }

  return (
    <View style={styles.screen}>
      <Animated.View entering={FadeInDown.duration(500)}>
        <Text style={styles.brand}>GYMCAT</Text>
        <Text style={styles.title}>{title}</Text>
      </Animated.View>
      {auth.mode === "local" ? (
        <Text style={styles.banner}>
          Supabase is not configured. Copy .env.example to .env and set
          EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY. Until
          then, sign-up and log-in stay on this device only and are not real
          accounts.
        </Text>
      ) : null}
      <TextInput
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        placeholder="Email"
        placeholderTextColor="#737373"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        autoCapitalize="none"
        autoComplete="password"
        placeholder="Password"
        placeholderTextColor="#737373"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <PressableScale
        accessibilityRole="button"
        disabled={busy}
        style={styles.button}
        onPress={() => {
          void submit();
        }}
      >
        {busy ? (
          <ActivityIndicator color="#0A0A0A" />
        ) : (
          <Text style={styles.buttonLabel}>{title}</Text>
        )}
      </PressableScale>
      {mode === "sign-in" ? (
        <Link href="/sign-up" style={styles.link}>
          Need an account? Sign up
        </Link>
      ) : (
        <Link href="/sign-in" style={styles.link}>
          Already have an account? Log in
        </Link>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#0A0A0A",
    gap: 12,
  },
  brand: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 56,
    fontWeight: "800",
    letterSpacing: -1.5,
    lineHeight: 58,
    marginBottom: 8,
  },
  banner: {
    color: "#A3A3A3",
    backgroundColor: "#141414",
    padding: 12,
    borderRadius: 12,
    lineHeight: 20,
  },
  input: {
    backgroundColor: "#141414",
    color: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
  },
  message: {
    color: "#FFFFFF",
  },
  button: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonLabel: {
    color: "#0A0A0A",
    fontSize: 16,
    fontWeight: "700",
  },
  link: {
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 8,
  },
});
