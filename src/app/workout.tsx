import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Shell } from "../components/shell";
import { colors, font } from "../theme";

const initial = [
  { n: "1", prev: "60 × 10", kg: "60", reps: "10", done: true },
  { n: "2", prev: "60 × 10", kg: "60", reps: "10", done: true },
  { n: "3", prev: "60 × 10", kg: "60", reps: "10", done: false },
];

export default function Workout() {
  const [sets, setSets] = useState(initial);
  const [resting, setResting] = useState(false);
  return (
    <Shell>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.top}>
          <Text style={styles.overview}>Workout session</Text>
          <View style={styles.topRight}>
            <Text style={styles.date}>Monday, June 16</Text>
            <View style={styles.pill}><Text style={styles.pillText}>3-week streak</Text></View>
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.head}>
            <View>
              <Text style={styles.progress}>WORKOUT IN PROGRESS</Text>
              <Text style={styles.h1}>Upper body A</Text>
              <Text style={styles.meta}>MON, JUN 16   /   6 exercises</Text>
            </View>
            <Pressable style={styles.finish}><Text style={styles.finishText}>Finish workout</Text></Pressable>
          </View>

          <View style={styles.metrics}>
            <Metric k="DURATION" v="18:42" />
            <Metric k="VOLUME" v="1,200 kg" />
            <Metric k="SETS" v="2 / 18" />
            <View style={styles.rest}>
              <Text style={styles.restK}>REST TIMER</Text>
              <Text style={styles.restV}>01:30</Text>
              <Text style={styles.restN}>{resting ? "Resting. Breathe." : "Ready for your next set?"}</Text>
              <Pressable style={styles.start} onPress={() => setResting((v) => !v)}>
                <Text style={styles.startText}>{resting ? "Stop timer" : "Start timer"}</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.exercise}>
            <View style={styles.exHead}>
              <View style={styles.badge}><Text style={styles.badgeText}>▦</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.exName}>Barbell bench press</Text>
                <Text style={styles.exSub}>Chest · 3 sets × 8–10 reps</Text>
              </View>
              <Text style={styles.more}>•••</Text>
            </View>
            <View style={styles.setHead}>
              {["SET", "PREVIOUS", "KG", "REPS", "DONE"].map((h) => (
                <Text key={h} style={styles.setHeadText}>{h}</Text>
              ))}
            </View>
            {sets.map((set, i) => (
              <View key={set.n} style={[styles.setRow, set.done ? styles.setDone : styles.setNext]}>
                <Text style={styles.cell}>{set.n}</Text>
                <Text style={styles.cell}>{set.prev}</Text>
                <Text style={styles.cell}>{set.kg}</Text>
                <Text style={styles.cell}>{set.reps}</Text>
                <Pressable
                  onPress={() => setSets((rows) => rows.map((row, idx) => idx === i ? { ...row, done: !row.done } : row))}
                  style={[styles.check, set.done ? styles.checkOn : styles.checkOff]}
                >
                  <Text style={styles.checkMark}>{set.done ? "✓" : "+"}</Text>
                </Pressable>
              </View>
            ))}
            <Pressable onPress={() => setSets((rows) => [...rows, { n: String(rows.length + 1), prev: "—", kg: "60", reps: "10", done: false }])}>
              <Text style={styles.add}>+  Add set</Text>
            </Pressable>
          </View>

          <View style={styles.lower}>
            <View style={styles.upNext}>
              <Text style={styles.nextK}>UP NEXT</Text>
              <Text style={styles.nextName}>Incline dumbbell press</Text>
              <Text style={styles.nextSub}>3 sets · 10–12 reps</Text>
              <Text style={styles.nextLink}>Next exercise  →</Text>
            </View>
            <View style={styles.one}>
              <Text style={styles.oneTitle}>One set at a time.</Text>
              <Text style={styles.oneBody}>Log your weight and reps, then mark each set complete. Rest. Repeat.</Text>
            </View>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerL}>6 exercises · 45–55 min planned</Text>
            <Text style={styles.footerR}>Keep the momentum going.</Text>
          </View>
        </View>
      </ScrollView>
    </Shell>
  );
}

function Metric({ k, v }: { k: string; v: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricK}>{k}</Text>
      <Text style={styles.metricV}>{v}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: 40 },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 36, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.line },
  overview: { fontFamily: font, fontSize: 15, fontWeight: "600", color: colors.ink },
  topRight: { flexDirection: "row", alignItems: "center", gap: 14 },
  date: { fontFamily: font, color: colors.muted, fontSize: 14 },
  pill: { backgroundColor: colors.sidebar, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  pillText: { fontFamily: font, fontSize: 13, color: colors.ink, fontWeight: "500" },
  body: { paddingHorizontal: 36, paddingTop: 26 },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  progress: { fontFamily: font, color: colors.orange, fontSize: 11, letterSpacing: 1.2, fontWeight: "700" },
  h1: { marginTop: 8, fontFamily: font, fontSize: 40, fontWeight: "700", letterSpacing: -1, color: colors.ink },
  meta: { marginTop: 8, fontFamily: font, color: colors.muted, fontSize: 14 },
  finish: { backgroundColor: colors.ink, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10 },
  finishText: { fontFamily: font, color: "#fff", fontWeight: "600", fontSize: 13 },
  metrics: { marginTop: 20, flexDirection: "row", gap: 12, alignItems: "stretch" },
  metric: { backgroundColor: "#F1F0EA", borderRadius: 16, padding: 16, minWidth: 130, justifyContent: "center" },
  metricK: { fontFamily: font, fontSize: 11, letterSpacing: 0.8, color: colors.faint, fontWeight: "600" },
  metricV: { marginTop: 8, fontFamily: font, fontSize: 26, fontWeight: "700", color: colors.ink, letterSpacing: -0.4 },
  rest: { marginLeft: "auto", backgroundColor: colors.dark, borderRadius: 18, padding: 16, minWidth: 220 },
  restK: { fontFamily: font, color: "#C9CDC4", fontSize: 11, letterSpacing: 0.8, fontWeight: "700" },
  restV: { marginTop: 4, fontFamily: font, color: colors.lime, fontSize: 32, fontWeight: "700" },
  restN: { fontFamily: font, color: "#C9CDC4", fontSize: 13, marginTop: 2 },
  start: { marginTop: 12, alignSelf: "flex-start", backgroundColor: colors.lime, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  startText: { fontFamily: font, fontWeight: "600", color: colors.ink, fontSize: 13 },
  exercise: { marginTop: 16, backgroundColor: "#fff", borderRadius: 20, padding: 18 },
  exHead: { flexDirection: "row", gap: 12, alignItems: "center" },
  badge: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#F6E8DE", alignItems: "center", justifyContent: "center" },
  badgeText: { color: colors.orange, fontSize: 16 },
  exName: { fontFamily: font, fontSize: 18, fontWeight: "600", color: colors.ink },
  exSub: { fontFamily: font, color: colors.muted, marginTop: 2 },
  more: { fontFamily: font, color: colors.faint, fontSize: 18, letterSpacing: 1 },
  setHead: { marginTop: 16, flexDirection: "row", paddingHorizontal: 8 },
  setHeadText: { flex: 1, fontFamily: font, fontSize: 11, letterSpacing: 0.8, color: colors.faint, fontWeight: "600" },
  setRow: { marginTop: 8, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 8, flexDirection: "row", alignItems: "center" },
  setDone: { backgroundColor: colors.setDone },
  setNext: { backgroundColor: colors.setNext },
  cell: { flex: 1, fontFamily: font, color: colors.ink, fontWeight: "500" },
  check: { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  checkOn: { backgroundColor: colors.ink },
  checkOff: { backgroundColor: colors.orange },
  checkMark: { color: "#fff", fontWeight: "700" },
  add: { marginTop: 14, fontFamily: font, color: colors.muted, fontWeight: "500" },
  lower: { marginTop: 14, flexDirection: "row", gap: 14 },
  upNext: { flex: 1, backgroundColor: "#fff", borderRadius: 18, padding: 16 },
  nextK: { fontFamily: font, fontSize: 11, letterSpacing: 1, color: colors.faint, fontWeight: "700" },
  nextName: { marginTop: 8, fontFamily: font, fontSize: 16, fontWeight: "600", color: colors.ink },
  nextSub: { marginTop: 4, fontFamily: font, color: colors.muted },
  nextLink: { marginTop: 12, fontFamily: font, color: colors.orange, fontWeight: "600" },
  one: { flex: 1, backgroundColor: "#F1F0EA", borderRadius: 18, padding: 16 },
  oneTitle: { fontFamily: font, fontSize: 16, fontWeight: "700", color: colors.ink },
  oneBody: { marginTop: 8, fontFamily: font, color: colors.muted, lineHeight: 20 },
  footer: { marginTop: 16, flexDirection: "row", justifyContent: "space-between" },
  footerL: { fontFamily: font, color: colors.muted, fontSize: 13 },
  footerR: { fontFamily: font, color: colors.muted, fontSize: 13 },
});
