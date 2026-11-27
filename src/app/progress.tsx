import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Shell } from "../components/shell";
import { colors, font } from "../theme";

const ranges = ["Week", "Month", "Year"] as const;
const bars = [42, 68, 54, 80, 100, 72, 88];

export default function Progress() {
  const [range, setRange] = useState<(typeof ranges)[number]>("Week");
  return (
    <Shell>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.top}>
          <Text style={styles.overview}>Training record</Text>
          <View style={styles.tabs}>
            {ranges.map((item) => (
              <Pressable key={item} onPress={() => setRange(item)} style={[styles.tab, range === item && styles.tabOn]}>
                <Text style={[styles.tabText, range === item && styles.tabTextOn]}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <Text style={styles.h1}>Your progress</Text>
        <Text style={styles.lede}>Small wins. Stronger every week.</Text>

        <View style={styles.row}>
          <View style={styles.volume}>
            <Text style={styles.volK}>VOLUME THIS WEEK</Text>
            <Text style={styles.volN}>24,050<Text style={styles.kg}> kg</Text></Text>
            <View style={styles.chart}>
              {bars.map((h, i) => (
                <View key={i} style={styles.col}>
                  <View style={[styles.bar, { height: h }, i === 4 && styles.barOn]} />
                </View>
              ))}
            </View>
          </View>
          <View style={styles.side}>
            <View style={styles.card}>
              <Text style={styles.k}>TIME TRAINED</Text>
              <Text style={styles.big}>6h 24m</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.k}>SESSIONS</Text>
              <Text style={styles.big}>3</Text>
            </View>
          </View>
        </View>

        <Text style={styles.section}>Personal records</Text>
        <View style={styles.prs}>
          <View style={styles.pr}>
            <Text style={styles.prName}>Barbell bench press</Text>
            <Text style={styles.prVal}>65 kg</Text>
          </View>
          <View style={styles.pr}>
            <Text style={styles.prName}>Best set</Text>
            <Text style={styles.prVal}>80 kg</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerT}>The work is adding up.</Text>
        </View>
      </ScrollView>
    </Shell>
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
  h1: { marginTop: 28, fontFamily: font, fontSize: 40, fontWeight: "700", letterSpacing: -1, color: colors.ink },
  lede: { marginTop: 8, fontFamily: font, fontSize: 16, color: colors.muted },
  row: { marginTop: 22, flexDirection: "row", gap: 16 },
  volume: { flex: 1.6, backgroundColor: colors.dark, borderRadius: 22, padding: 22, minHeight: 280 },
  volK: { fontFamily: font, color: colors.lime, fontSize: 11, letterSpacing: 1.1, fontWeight: "700" },
  volN: { marginTop: 12, fontFamily: font, color: "#fff", fontSize: 42, fontWeight: "700", letterSpacing: -1 },
  kg: { fontSize: 18, fontWeight: "500", color: "#C9CDC4" },
  chart: { marginTop: 28, flexDirection: "row", alignItems: "flex-end", gap: 12, height: 120 },
  col: { flex: 1, justifyContent: "flex-end" },
  bar: { backgroundColor: "#3C4336", borderRadius: 8 },
  barOn: { backgroundColor: colors.lime },
  side: { flex: 0.8, gap: 16 },
  card: { flex: 1, backgroundColor: "#fff", borderRadius: 18, padding: 18, justifyContent: "space-between" },
  k: { fontFamily: font, fontSize: 11, letterSpacing: 0.8, color: colors.faint, fontWeight: "700" },
  big: { fontFamily: font, fontSize: 32, fontWeight: "700", color: colors.ink, letterSpacing: -0.6 },
  section: { marginTop: 26, fontFamily: font, fontSize: 18, fontWeight: "600", color: colors.ink },
  prs: { marginTop: 12, flexDirection: "row", gap: 14 },
  pr: { flex: 1, backgroundColor: "#fff", borderRadius: 18, padding: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  prName: { fontFamily: font, fontSize: 15, fontWeight: "600", color: colors.ink },
  prVal: { fontFamily: font, fontSize: 20, fontWeight: "700", color: colors.ink },
  footer: { marginTop: 16, backgroundColor: "#F1F0EA", borderRadius: 16, padding: 16 },
  footerT: { fontFamily: font, fontWeight: "600", color: colors.ink },
});
