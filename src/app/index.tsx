import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Shell } from "../components/shell";
import { colors, font } from "../theme";

const days = [
  { label: "M", n: "16", on: true },
  { label: "T", n: "17" },
  { label: "W", n: "18" },
  { label: "T", n: "19" },
  { label: "F", n: "20" },
  { label: "S", n: "21" },
  { label: "S", n: "22" },
];

export default function Today() {
  return (
    <Shell>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.top}>
          <Text style={styles.overview}>Overview</Text>
          <View style={styles.topRight}>
            <Text style={styles.date}>Monday, June 16</Text>
            <View style={styles.streakPill}>
              <Text style={styles.streakText}>3-week streak</Text>
            </View>
          </View>
        </View>

        <Text style={styles.eyebrow}>MONDAY, JUNE 16</Text>
        <Text style={styles.h1}>Build your stronger self.</Text>
        <Text style={styles.lede}>Your plan is ready. Make today count.</Text>

        <View style={styles.heroRow}>
          <View style={styles.dark}>
            <Text style={styles.limeLabel}>YOUR NEXT WORKOUT</Text>
            <Text style={styles.darkTitle}>Upper body A</Text>
            <Text style={styles.darkSub}>Build strength, one rep at a time.</Text>
            <Text style={styles.darkMeta}>6 exercises  ·  45–55 min</Text>
            <Link href="/workout" asChild>
              <Pressable style={styles.cta}>
                <Text style={styles.ctaText}>Start workout</Text>
                <Text style={styles.ctaArrow}>→</Text>
              </Pressable>
            </Link>
          </View>
          <View style={styles.sideCol}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Your training week</Text>
              <View style={styles.week}>
                {days.map((day, i) => (
                  <View key={i} style={styles.day}>
                    <Text style={styles.dayLabel}>{day.label}</Text>
                    <View style={[styles.dayNum, day.on && styles.dayOn]}>
                      <Text style={[styles.dayNumText, day.on && styles.dayOnText]}>{day.n}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Your week, so far</Text>
              <Text style={styles.weekMeta}>2 of 3 workouts complete</Text>
              <View style={styles.track}>
                <View style={styles.bar} />
              </View>
              <Text style={styles.note}>A strong week starts with showing up.</Text>
            </View>
          </View>
        </View>

        <Text style={styles.section}>Your training at a glance</Text>
        <View style={styles.stats}>
          <Stat kicker="WORKOUTS THIS WEEK" value="2" />
          <Stat kicker="TIME WELL SPENT" value="1h 42m" />
          <Stat kicker="CURRENT STREAK" value="3 weeks" />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerStrong}>Progress over perfection.</Text>
          <Text style={styles.footerSoft}>Every workout is a step forward.</Text>
        </View>
      </ScrollView>
    </Shell>
  );
}

function Stat({ kicker, value }: { kicker: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statKicker}>{kicker}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: 36, paddingTop: 22, paddingBottom: 40 },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", marginHorizontal: -36, paddingHorizontal: 36, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.line },
  overview: { fontFamily: font, fontSize: 15, fontWeight: "600", color: colors.ink },
  topRight: { flexDirection: "row", alignItems: "center", gap: 14 },
  date: { fontFamily: font, color: colors.muted, fontSize: 14 },
  streakPill: { backgroundColor: colors.sidebar, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  streakText: { fontFamily: font, fontSize: 13, color: colors.ink, fontWeight: "500" },
  eyebrow: { marginTop: 28, fontFamily: font, fontSize: 11, letterSpacing: 1.2, color: colors.faint, fontWeight: "600" },
  h1: { marginTop: 8, fontFamily: font, fontSize: 40, fontWeight: "700", letterSpacing: -1.1, color: colors.ink },
  lede: { marginTop: 8, fontFamily: font, fontSize: 16, color: colors.muted },
  heroRow: { marginTop: 22, flexDirection: "row", gap: 16, alignItems: "stretch" },
  dark: { flex: 1.35, backgroundColor: colors.dark, borderRadius: 22, padding: 26 },
  limeLabel: { fontFamily: font, color: colors.lime, fontSize: 11, letterSpacing: 1.2, fontWeight: "700" },
  darkTitle: { marginTop: 14, fontFamily: font, color: "#fff", fontSize: 36, fontWeight: "700", letterSpacing: -0.8 },
  darkSub: { marginTop: 8, fontFamily: font, color: "#C9CDC4", fontSize: 16 },
  darkMeta: { marginTop: 18, fontFamily: font, color: "#A7ACA3", fontSize: 14 },
  cta: { marginTop: 22, backgroundColor: colors.lime, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  ctaText: { fontFamily: font, fontSize: 15, fontWeight: "600", color: colors.ink },
  ctaArrow: { fontFamily: font, fontSize: 18, color: colors.ink },
  sideCol: { flex: 1, gap: 16 },
  card: { backgroundColor: colors.card, borderRadius: 20, padding: 18 },
  cardTitle: { fontFamily: font, fontSize: 16, fontWeight: "600", color: colors.ink, marginBottom: 14 },
  week: { flexDirection: "row", justifyContent: "space-between" },
  day: { alignItems: "center", gap: 8 },
  dayLabel: { fontFamily: font, fontSize: 12, color: colors.faint },
  dayNum: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: "#F3F1EA" },
  dayOn: { backgroundColor: colors.ink },
  dayNumText: { fontFamily: font, fontSize: 13, color: colors.ink, fontWeight: "600" },
  dayOnText: { color: "#fff" },
  weekMeta: { fontFamily: font, fontSize: 14, color: colors.ink, marginBottom: 10 },
  track: { height: 6, backgroundColor: colors.track, borderRadius: 99, overflow: "hidden" },
  bar: { width: "66%", height: 6, backgroundColor: colors.red, borderRadius: 99 },
  note: { marginTop: 12, fontFamily: font, fontSize: 13, color: colors.muted },
  section: { marginTop: 28, fontFamily: font, fontSize: 18, fontWeight: "600", color: colors.ink },
  stats: { marginTop: 12, flexDirection: "row", gap: 14 },
  stat: { flex: 1, backgroundColor: colors.card, borderRadius: 18, padding: 18, minHeight: 110, justifyContent: "space-between" },
  statKicker: { fontFamily: font, fontSize: 11, letterSpacing: 0.8, color: colors.faint, fontWeight: "600" },
  statValue: { fontFamily: font, fontSize: 28, fontWeight: "700", letterSpacing: -0.6, color: colors.ink },
  footer: { marginTop: 16, backgroundColor: "#F1F0EA", borderRadius: 16, paddingVertical: 16, paddingHorizontal: 18, flexDirection: "row", justifyContent: "space-between" },
  footerStrong: { fontFamily: font, fontSize: 14, fontWeight: "600", color: colors.ink },
  footerSoft: { fontFamily: font, fontSize: 14, color: colors.muted },
});
