import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Session } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { supabaseConfig } from "@/lib/config";
import { supabase } from "@/lib/supabase";

const LOCAL_SESSION_KEY = "gymcat.localSession";

type LocalSession = {
  email: string;
};

export type AuthContextValue = {
  ready: boolean;
  /** Supabase is wired via env. Otherwise sign-in stays on this device only. */
  mode: "supabase" | "local";
  email: string | null;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function validate(email: string, password: string): string | null {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Enter a valid email address.";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters.";
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const mode: AuthContextValue["mode"] = supabaseConfig.isConfigured
    ? "supabase"
    : "local";
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function restore() {
      if (supabase) {
        const { data } = await supabase.auth.getSession();
        if (!cancelled) {
          setEmail(data.session?.user.email ?? null);
          setReady(true);
        }
        return;
      }

      const raw = await AsyncStorage.getItem(LOCAL_SESSION_KEY);
      if (cancelled) return;
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as LocalSession;
          setEmail(parsed.email);
        } catch {
          await AsyncStorage.removeItem(LOCAL_SESSION_KEY);
        }
      }
      setReady(true);
    }

    void restore();

    if (!supabase) {
      return () => {
        cancelled = true;
      };
    }

    const { data } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setEmail(session?.user.email ?? null);
      },
    );

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (rawEmail: string, password: string) => {
    const email = normalizeEmail(rawEmail);
    const problem = validate(email, password);
    if (problem) return problem;

    if (!supabase) {
      await AsyncStorage.setItem(
        LOCAL_SESSION_KEY,
        JSON.stringify({ email } satisfies LocalSession),
      );
      setEmail(email);
      return null;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return error?.message ?? null;
  }, []);

  const signUp = useCallback(async (rawEmail: string, password: string) => {
    const email = normalizeEmail(rawEmail);
    const problem = validate(email, password);
    if (problem) return problem;

    if (!supabase) {
      await AsyncStorage.setItem(
        LOCAL_SESSION_KEY,
        JSON.stringify({ email } satisfies LocalSession),
      );
      setEmail(email);
      return null;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return error.message;
    if (!data.session) {
      return "Check your email to confirm the account, then log in.";
    }
    return null;
  }, []);

  const signOut = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    await AsyncStorage.removeItem(LOCAL_SESSION_KEY);
    setEmail(null);
  }, []);

  const value = useMemo(
    () => ({ ready, mode, email, signIn, signUp, signOut }),
    [ready, mode, email, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return value;
}
