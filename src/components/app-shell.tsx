import { router, usePathname } from "expo-router";
import { useState } from "react";
import { type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";

import { colors, type as fonts } from "@/constants/theme";

const links = [
  { href: "/(app)", label: "Calendar & Weekly Split", match: /^\/(\(app\))?$/ },
  { href: "anatomy", label: "3D Anatomy & Muscle Target", match: /\/day\// },
  { href: "library", label: "Exercise Library & Biomechanics", match: /\/train\/|\/exercise\// },
  { href: "/nutrition", label: "Nutrition & Fuel Matrix", match: /nutrition/ },
  { href: "/profile", label: "User Profile & Biometrics", match: /profile/ },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const { width } = useWindowDimensions();
  const wide = width >= 960;
  const [today] = useState(() => new Date().toISOString().slice(0, 10));

  function go(href: (typeof links)[number]["href"]) {
    if (href === "anatomy" || href === "library") {
      router.push(`/day/${today}`);
      return;
    }
    router.push(href);
  }

  return (
    <View style={[styles.root, wide && styles.rootWide]}>
      <View style={[styles.side, wide ? styles.sideWide : styles.sideNarrow]}>
        <Text style={styles.mark}>KINETIX</Text>
        <Text style={styles.markSub}>BIOMECHANICAL HUD</Text>
        <Text style={styles.group}>TRAINING ARCHITECTURE</Text>
        {links.map((link) => {
          const active = link.match.test(path);
          return (
            <Pressable
              key={link.label}
              accessibilityRole="button"
              onPress={() => {
                go(link.href);
              }}
              style={[styles.link, active && styles.linkActive]}
            >
              <Text style={[styles.linkText, active && styles.linkTextActive]}>{link.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.main}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  rootWide: { flexDirection: "row" },
  side: { padding: 16, gap: 6, borderColor: colors.line, borderBottomWidth: 1 },
  sideWide: { width: 248, borderBottomWidth: 0, borderRightWidth: 1, paddingTop: 24 },
  sideNarrow: { paddingBottom: 10 },
  mark: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 22,
    letterSpacing: -0.5,
  },
  markSub: {
    color: colors.volt,
    fontFamily: fonts.headline,
    fontSize: 10,
    letterSpacing: 1.4,
    marginBottom: 12,
  },
  group: {
    color: colors.muted,
    fontFamily: fonts.headline,
    fontSize: 10,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  link: { borderRadius: 8, paddingVertical: 8, paddingHorizontal: 10 },
  linkActive: { backgroundColor: colors.volt },
  linkText: { color: colors.muted, fontFamily: fonts.body, fontSize: 13 },
  linkTextActive: { color: colors.ink, fontFamily: fonts.bodyBold },
  main: { flex: 1 },
});
