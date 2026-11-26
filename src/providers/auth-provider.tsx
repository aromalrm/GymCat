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
import type { Profile } from "@/lib/profile";
import { parseProfile } from "@/lib/profile";
import { fetchProfile, saveProfile as saveRemoteProfile } from "@/lib/profile-store";
import { supabase } from "@/lib/supabase";

const LOCAL_SESSION_KEY = "gymcat.localSession";
const LOCAL_PROFILES_KEY = "gymcat.localProfiles";

type LocalSession = {
  email: string;
};

export type AuthContextValue = {
  ready: boolean;
  /** Supabase is wired via env. Otherwise sign-in stays on this device only. */
  mode: "supabase" | "local";
  email: string | null;
  /** Set when onboarding has been saved. Null means onboarding is still required. */
  profile: Profile | null;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  saveProfile: (profile: Profile) => Promise<string | null>;
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
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const applyLocal = useCallback(async (nextEmail: string | null) => {
    setEmail(nextEmail);
    setUserId(null);
    if (!nextEmail) {
      setProfile(null);
      return;
    }
    const raw = await AsyncStorage.getItem(LOCAL_PROFILES_KEY);
    if (!raw) {
      setProfile(null);
      return;
    }
    try {
      const stored = JSON.parse(raw) as Record<string, unknown>;
      setProfile(parseProfile(stored[nextEmail]));
    } catch {
      setProfile(null);
    }
  }, []);

  const applyRemote = useCallback(async (session: Session | null) => {
    const nextEmail = session?.user.email ?? null;
    const nextId = session?.user.id ?? null;
    setEmail(nextEmail);
    setUserId(nextId);
    if (!supabase || !nextId) {
      setProfile(null);
      return;
    }
    const { profile: loaded } = await fetchProfile(supabase, nextId);
    setProfile(loaded);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function restore() {
      if (supabase) {
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        await applyRemote(data.session);
        if (!cancelled) setReady(true);
        return;
      }

      const raw = await AsyncStorage.getItem(LOCAL_SESSION_KEY);
      if (cancelled) return;
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as LocalSession;
          await applyLocal(parsed.email);
        } catch {
          await AsyncStorage.removeItem(LOCAL_SESSION_KEY);
          await applyLocal(null);
        }
      }
      if (!cancelled) setReady(true);
    }

    void restore();

    if (!supabase) {
      return () => {
        cancelled = true;
      };
    }

    const { data } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        void applyRemote(session);
      },
    );

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, [applyLocal, applyRemote]);

  const signIn = useCallback(async (rawEmail: string, password: string) => {
    const email = normalizeEmail(rawEmail);
    const problem = validate(email, password);
    if (problem) return problem;

    if (!supabase) {
      await AsyncStorage.setItem(
        LOCAL_SESSION_KEY,
        JSON.stringify({ email } satisfies LocalSession),
      );
      await applyLocal(email);
      return null;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return error?.message ?? null;
  }, [applyLocal]);

  const signUp = useCallback(async (rawEmail: string, password: string) => {
    const email = normalizeEmail(rawEmail);
    const problem = validate(email, password);
    if (problem) return problem;

    if (!supabase) {
      await AsyncStorage.setItem(
        LOCAL_SESSION_KEY,
        JSON.stringify({ email } satisfies LocalSession),
      );
      await applyLocal(email);
      return null;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return error.message;
    if (!data.session) {
      return "Check your email to confirm the account, then log in.";
    }
    return null;
  }, [applyLocal]);

  const signOut = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    await AsyncStorage.removeItem(LOCAL_SESSION_KEY);
    setEmail(null);
    setUserId(null);
    setProfile(null);
  }, []);

  const saveProfile = useCallback(
    async (next: Profile) => {
      if (!supabase) {
        if (!email) return "Sign in before saving a profile.";
        const raw = await AsyncStorage.getItem(LOCAL_PROFILES_KEY);
        const stored: Record<string, Profile> = raw
          ? (JSON.parse(raw) as Record<string, Profile>)
          : {};
        stored[email] = next;
        await AsyncStorage.setItem(LOCAL_PROFILES_KEY, JSON.stringify(stored));
        setProfile(next);
        return null;
      }
      if (!userId) return "Sign in before saving a profile.";
      const error = await saveRemoteProfile(supabase, userId, next);
      if (!error) setProfile(next);
      return error;
    },
    [email, userId],
  );

  const value = useMemo(
    () => ({ ready, mode, email, profile, signIn, signUp, signOut, saveProfile }),
    [ready, mode, email, profile, signIn, signUp, signOut, saveProfile],
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
