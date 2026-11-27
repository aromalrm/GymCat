import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Shell } from "../components/shell";
import { colors, font } from "../theme";

const ranges = ["Week", "Month", "Year"] as const;
const bars = [
  { label: "May 26", h: 72 },
  { label: "Jun 2", h: 96 },
  { label: "Jun 9", h: 78 },
  { label: "Jun 16", h: 140 },
];

export default function Progress() {
  const [range, setRange] = useState<(typeof ranges)[number]>("Week");
  return (
    <Shell>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.top}>
          <Text style={styles.overview}>Training insights</Text>
          <View style={styles.tabs}>
            {ranges.map((item) => (
              <Pressable key={item} onPress={() => setRange(item)} style={[styles.tab, range === item && styles.tabOn]}>
                <Text style={[styles.tabText, range === item && styles.tabTextOn]}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <Text style={styles.eyebrow}>TRAINING INSIGHTS</Text>
        <Text style={styles.h1}>Your progress</Text>
        <Text style={styles.lede}>Small steps. Stronger every week.</Text>

        <View style={styles.stats}>
          <Stat k="WORKOUTS" v="8" />
          <Stat k="TRAINING TIME" v="6h 24m" />
          <Stat k="NEW PRS" v="3" />
        </View>

        <View style={styles.row}>
          <View style={styles.volume}>
            <View style={styles.volHead}>
              <View>
                <Text style={styles.volK}>TOTAL VOLUME</Text>
                <Text style={styles.volN}>24,850<Text style={styles.kg}> kg</Text></Text>
              </View>
              <View style={styles.delta}><Text style={styles.deltaText}>↑ 12.8%   vs. last month</Text></View>
            </View>
            <View style={styles.chart}>
              {bars.map((bar) => (
                <View key={bar.label} style={styles.col}>
                  <View style={[styles.bar, { height: bar.h }, bar.label === "Jun 16" && styles.barOn]} />
                  <Text style={styles.barLabel}>{bar.label}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.prs}>
            <View style={styles.prHead}>
              <Text style={styles.prTitle}>Personal records</Text>
              <Text style={styles.viewAll}>VIEW ALL</Text>
            </View>
            <Record name="Barbell bench press" date="Jun 12" value="65 kg" />
            <Record name="Barbell squat" date="Jun 9" value="90 kg" />
          </View>
        </View>

        <Text style={styles.closing}>The work is adding up.</Text>
        <Text style={styles.closingSub}>Keep showing up. Every rep is an investment in your stronger self.</Text>
      </ScrollView>
    </Shell>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.k}>{k}</Text>
      <Text style={styles.big}>{v}</Text>
    </View>
  );
}

function Record({ name, date, value }: { name: string; date: string; value: string }) {
  return (
    <View style={styles.pr}>
      <View>
        <Text style={styles.prName}>{name}</Text>
        <Text style={styles.prDate}>{date}</Text>
      </View>
      <Text style={styles.prVal}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: 36, paddingBottom: 40 },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", marginHorizontal: -36, paddingHorizontal: 36, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.line },
  overview: { fontFamily: font, fontSize: 15, fontWeight: "600", color: colors.ink },
  tabs: { flexDirection: "row", backgroundColor: colors.sidebar, borderRadius: 999, padding: 4, gap: 4 },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  tabOn: { backgroundColor: "#fff" },
  tabText: { fontFamily: font, color: colors.muted, fontSize: 13, fontWeight: "500" },
  tabTextOn: { color: colors.ink, fontWeight: "600" },
  eyebrow: { marginTop: 28, fontFamily: font, fontSize: 11, letterSpacing: 1.2, color: colors.faint, fontWeight: "700" },
  h1: { marginTop: 8, fontFamily: font, fontSize: 40, fontWeight: "700", letterSpacing: -1, color: colors.ink },
  lede: { marginTop: 8, fontFamily: font, fontSize: 16, color: colors.muted },
  stats: { marginTop: 20, flexDirection: "row", gap: 14 },
  stat: { flex: 1, backgroundColor: "#fff", borderRadius: 18, padding: 18 },
  k: { fontFamily: font, fontSize: 11, letterSpacing: 0.8, color: colors.faint, fontWeight: "700" },
  big: { marginTop: 8, fontFamily: font, fontSize: 32, fontWeight: "700", color: colors.ink, letterSpacing: -0.6 },
  row: { marginTop: 16, flexDirection: "row", gap: 16, alignItems: "stretch" },
  volume: { flex: 1.7, backgroundColor: colors.dark, borderRadius: 22, padding: 22 },
  volHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  volK: { fontFamily: font, color: "#C9CDC4", fontSize: 11, letterSpacing: 1.1, fontWeight: "700" },
  volN: { marginTop: 8, fontFamily: font, color: "#fff", fontSize: 40, fontWeight: "700", letterSpacing: -1 },
  kg: { fontSize: 18, fontWeight: "500", color: "#C9CDC4" },
  delta: { backgroundColor: "#2C3328", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  deltaText: { fontFamily: font, color: colors.lime, fontSize: 12, fontWeight: "600" },
  chart: { marginTop: 28, flexDirection: "row", alignItems: "flex-end", gap: 18, height: 170 },
  col: { flex: 1, alignItems: "center", justifyContent: "flex-end" },
  bar: { width: "70%", backgroundColor: "#3C4336", borderRadius: 10 },
  barOn: { backgroundColor: colors.lime },
  barLabel: { marginTop: 8, fontFamily: font, color: "#A7ACA3", fontSize: 12 },
  prs: { flex: 0.9, backgroundColor: "#fff", borderRadius: 20, padding: 18, gap: 12 },
  prHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  prTitle: { fontFamily: font, fontSize: 16, fontWeight: "600", color: colors.ink },
  viewAll: { fontFamily: font, fontSize: 11, letterSpacing: 0.8, color: colors.faint, fontWeight: "700" },
  pr: { backgroundColor: "#F7F6F2", borderRadius: 14, padding: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  prName: { fontFamily: font, fontSize: 14, fontWeight: "600", color: colors.ink },
  prDate: { marginTop: 4, fontFamily: font, fontSize: 12, color: colors.muted },
  prVal: { fontFamily: font, fontSize: 18, fontWeight: "700", color: colors.ink },
  closing: { marginTop: 22, fontFamily: font, fontSize: 20, fontWeight: "700", color: colors.ink },
  closingSub: { marginTop: 6, fontFamily: font, color: colors.muted, fontSize: 14 },
});
