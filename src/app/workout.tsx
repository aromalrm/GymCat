import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Shell } from "../components/shell";
import { colors, font } from "../theme";

const sets = [
  { n: "1", prev: "60 × 10", tone: "done" as const },
  { n: "2", prev: "60 × 10", tone: "done" as const },
  { n: "3", prev: "60 × 10", tone: "next" as const },
];

export default function Workout() {
  return (
    <Shell>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.top}>
          <Text style={styles.overview}>Workout session</Text>
          <Text style={styles.date}>Monday, June 16</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.col}>
            <Text style={styles.progress}>WORKOUT IN PROGRESS</Text>
            <Text style={styles.h1}>Upper body A</Text>
            <Text style={styles.meta}>MON, JUN 16   /   6 exercises</Text>

            <View style={styles.metrics}>
              <View style={styles.metric}>
                <Text style={styles.metricK}>DURATION</Text>
                <Text style={styles.metricV}>18:42</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricK}>VOLUME</Text>
                <Text style={styles.metricV}>1,200 kg</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricK}>SETS</Text>
                <Text style={styles.metricV}>2 / 18</Text>
              </View>
              <View style={styles.end}>
                <Text style={styles.endText}>End now</Text>
              </View>
            </View>

            <View style={styles.exercise}>
              <View style={styles.exHead}>
                <View style={styles.badge}><Text style={styles.badgeText}>▦</Text></View>
                <View>
                  <Text style={styles.exName}>Barbell bench press</Text>
                  <Text style={styles.exSub}>Chest · 3 sets × 8</Text>
                </View>
              </View>
              <View style={styles.setHead}>
                <Text style={styles.setHeadText}>SET</Text>
                <Text style={styles.setHeadText}>PREVIOUS</Text>
              </View>
              {sets.map((set) => (
                <View key={set.n} style={[styles.setRow, set.tone === "done" ? styles.setDone : styles.setNext]}>
                  <Text style={styles.setN}>{set.n}</Text>
                  <Text style={styles.setPrev}>{set.prev}</Text>
                </View>
              ))}
              <Text style={styles.add}>+  Add set</Text>
            </View>

            <View style={styles.next}>
              <Text style={styles.nextK}>NEXT</Text>
              <Text style={styles.nextName}>Incline dumbbell press</Text>
              <Text style={styles.one}>One set at a time.</Text>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerL}>6 exercises · 45–55 min planned</Text>
              <Text style={styles.footerR}>Keep the momentum going.</Text>
            </View>
            <View style={styles.coach}>
              <Text style={styles.coachText}>Log your weight and reps, then mark each set complete. Rest. Repeat.</Text>
            </View>
          </View>
          <View style={styles.rail}>
            <View style={styles.keep}>
              <Text style={styles.keepK}>KEEP SHOWING UP</Text>
              <Text style={styles.keepV}>2 of 3 workouts</Text>
              <View style={styles.track}><View style={styles.bar} /></View>
              <Text style={styles.keepN}>One more. You’ve got this.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Shell>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: 36 },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 36, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.line },
  overview: { fontFamily: font, fontSize: 15, fontWeight: "600", color: colors.ink },
  date: { fontFamily: font, color: colors.muted, fontSize: 14 },
  body: { flexDirection: "row", paddingHorizontal: 36, paddingTop: 26, gap: 20 },
  col: { flex: 1 },
  rail: { width: 260 },
  progress: { fontFamily: font, color: colors.orange, fontSize: 11, letterSpacing: 1.2, fontWeight: "700" },
  h1: { marginTop: 8, fontFamily: font, fontSize: 40, fontWeight: "700", letterSpacing: -1, color: colors.ink },
  meta: { marginTop: 8, fontFamily: font, color: colors.muted, fontSize: 14 },
  metrics: { marginTop: 20, flexDirection: "row", gap: 12, alignItems: "stretch" },
  metric: { backgroundColor: "#F1F0EA", borderRadius: 16, padding: 16, minWidth: 120 },
  metricK: { fontFamily: font, fontSize: 11, letterSpacing: 0.8, color: colors.faint, fontWeight: "600" },
  metricV: { marginTop: 8, fontFamily: font, fontSize: 26, fontWeight: "700", color: colors.ink, letterSpacing: -0.4 },
  end: { marginLeft: "auto", backgroundColor: colors.lime, borderRadius: 999, paddingHorizontal: 16, justifyContent: "center" },
  endText: { fontFamily: font, fontWeight: "600", color: colors.ink },
  exercise: { marginTop: 18, backgroundColor: "#fff", borderRadius: 20, padding: 18 },
  exHead: { flexDirection: "row", gap: 12, alignItems: "center" },
  badge: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#F6E8DE", alignItems: "center", justifyContent: "center" },
  badgeText: { color: colors.orange, fontSize: 16 },
  exName: { fontFamily: font, fontSize: 18, fontWeight: "600", color: colors.ink },
  exSub: { fontFamily: font, color: colors.muted, marginTop: 2 },
  setHead: { marginTop: 16, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 14 },
  setHeadText: { fontFamily: font, fontSize: 11, letterSpacing: 0.8, color: colors.faint, fontWeight: "600" },
  setRow: { marginTop: 8, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 14, flexDirection: "row", justifyContent: "space-between" },
  setDone: { backgroundColor: colors.setDone },
  setNext: { backgroundColor: colors.setNext },
  setN: { fontFamily: font, fontWeight: "600", color: colors.ink },
  setPrev: { fontFamily: font, color: colors.ink },
  add: { marginTop: 12, fontFamily: font, color: colors.muted, fontWeight: "500" },
  next: { marginTop: 14, backgroundColor: "#fff", borderRadius: 18, padding: 16 },
  nextK: { fontFamily: font, fontSize: 11, letterSpacing: 1, color: colors.faint, fontWeight: "700" },
  nextName: { marginTop: 6, fontFamily: font, fontSize: 16, fontWeight: "600", color: colors.ink },
  one: { marginTop: 6, fontFamily: font, color: colors.muted },
  footer: { marginTop: 16, flexDirection: "row", justifyContent: "space-between" },
  footerL: { fontFamily: font, color: colors.muted, fontSize: 13 },
  footerR: { fontFamily: font, color: colors.muted, fontSize: 13 },
  coach: { marginTop: 10, backgroundColor: "#F1F0EA", borderRadius: 16, padding: 16 },
  coachText: { fontFamily: font, color: colors.ink, fontSize: 14 },
  keep: { backgroundColor: "#fff", borderRadius: 18, padding: 16 },
  keepK: { fontFamily: font, fontSize: 11, letterSpacing: 0.8, color: colors.faint, fontWeight: "700" },
  keepV: { marginTop: 10, fontFamily: font, fontSize: 18, fontWeight: "700", color: colors.ink },
  track: { marginTop: 10, height: 6, backgroundColor: colors.track, borderRadius: 99, overflow: "hidden" },
  bar: { width: "66%", height: 6, backgroundColor: colors.red },
  keepN: { marginTop: 10, fontFamily: font, color: colors.muted, fontSize: 13 },
});
