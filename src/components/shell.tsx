import { Link, usePathname } from "expo-router";
import type { ReactNode } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, font } from "../theme";

const items = [
  { href: "/", label: "Today" },
  { href: "/workout", label: "Workout" },
  { href: "/progress", label: "Progress" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  return (
    <View style={styles.root}>
      <View style={styles.sidebar}>
        <View>
          <Text style={styles.mark}>GymCat</Text>
          <Text style={styles.kicker}>YOUR TRAINING SPACE</Text>
          <View style={styles.nav}>
            {items.map((item) => {
              const active = path === item.href;
              return (
                <Link key={item.href} href={item.href} asChild>
                  <Pressable style={[styles.navItem, active && styles.navItemActive]}>
                    <Text style={[styles.navIcon, active && styles.navIconActive]}>
                      {item.label === "Today" ? "⌂" : item.label === "Workout" ? "▦" : "▮"}
                    </Text>
                    <Text style={[styles.navLabel, active && styles.navLabelActive]}>{item.label}</Text>
                  </Pressable>
                </Link>
              );
            })}
          </View>
        </View>
        <View>
          <View style={styles.keep}>
            <Text style={styles.keepK}>KEEP SHOWING UP</Text>
            <Text style={styles.keepV}>2 of 3 workouts</Text>
            <View style={styles.track}>
              <View style={styles.bar} />
            </View>
            <Text style={styles.keepN}>One more. You’ve got this.</Text>
          </View>
          <Text style={styles.club}>GYMCAT / STRENGTH CLUB</Text>
          <Text style={styles.clubLine}>A little stronger, every day.</Text>
        </View>
      </View>
      <View style={styles.main}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: "row", backgroundColor: colors.page, minHeight: Platform.OS === "web" ? ("100vh" as unknown as number) : undefined },
  sidebar: {
    width: 248,
    backgroundColor: colors.sidebar,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 24,
    justifyContent: "space-between",
  },
  mark: { fontFamily: font, fontSize: 28, fontWeight: "700", letterSpacing: -0.6, color: colors.ink },
  kicker: { marginTop: 6, fontFamily: font, fontSize: 10, letterSpacing: 1.4, color: colors.faint, fontWeight: "600" },
  nav: { marginTop: 28, gap: 6 },
  navItem: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14 },
  navItemActive: { backgroundColor: colors.navActive },
  navIcon: { fontFamily: font, color: colors.muted, width: 16 },
  navIconActive: { color: colors.orange },
  navLabel: { fontFamily: font, fontSize: 15, color: colors.ink, fontWeight: "500" },
  navLabelActive: { fontWeight: "600" },
  keep: { backgroundColor: colors.card, borderRadius: 16, padding: 14, marginBottom: 18 },
  keepK: { fontFamily: font, fontSize: 10, letterSpacing: 0.8, color: colors.faint, fontWeight: "700" },
  keepV: { marginTop: 8, fontFamily: font, fontSize: 15, fontWeight: "700", color: colors.ink },
  track: { marginTop: 8, height: 5, backgroundColor: colors.track, borderRadius: 99, overflow: "hidden" },
  bar: { width: "66%", height: 5, backgroundColor: colors.red },
  keepN: { marginTop: 8, fontFamily: font, fontSize: 12, color: colors.muted },
  club: { fontFamily: font, fontSize: 11, letterSpacing: 0.8, color: colors.ink, fontWeight: "700" },
  clubLine: { marginTop: 4, fontFamily: font, fontSize: 13, color: colors.muted },
  main: { flex: 1, backgroundColor: colors.page },
});
