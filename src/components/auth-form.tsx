import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

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
      <Text style={styles.brand}>GymCat</Text>
      <Text style={styles.title}>{title}</Text>
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
        placeholderTextColor="#8A8175"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        autoCapitalize="none"
        autoComplete="password"
        placeholder="Password"
        placeholderTextColor="#8A8175"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <Pressable
        accessibilityRole="button"
        disabled={busy}
        style={styles.button}
        onPress={() => {
          void submit();
        }}
      >
        {busy ? (
          <ActivityIndicator color="#1A140C" />
        ) : (
          <Text style={styles.buttonLabel}>{title}</Text>
        )}
      </Pressable>
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
    backgroundColor: "#14110E",
    gap: 12,
  },
  brand: {
    color: "#F2C14E",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    color: "#F7F1E8",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  banner: {
    color: "#E7D7B8",
    backgroundColor: "#2A241C",
    padding: 12,
    borderRadius: 12,
    lineHeight: 20,
  },
  input: {
    backgroundColor: "#221C16",
    color: "#F7F1E8",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
  },
  message: {
    color: "#F0A07A",
  },
  button: {
    backgroundColor: "#F2C14E",
    borderRadius: 12,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonLabel: {
    color: "#1A140C",
    fontSize: 16,
    fontWeight: "700",
  },
  link: {
    color: "#F2C14E",
    textAlign: "center",
    marginTop: 8,
  },
});
