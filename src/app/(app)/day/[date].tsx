import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { labelPart, listBodyParts, type BodyPart } from "@/lib/catalog";
import { isIsoDate, logsForDate, type DayLog } from "@/lib/workout-logs";
import { useAuth } from "@/providers/auth-provider";

export default function DayScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { email } = useAuth();
  const valid = typeof date === "string" && isIsoDate(date);
  const [logs, setLogs] = useState<DayLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(valid);
  const [parts, setParts] = useState<BodyPart[]>([]);
  const [partsError, setPartsError] = useState<string | null>(null);

  const loadLogs = useCallback(() => {
    if (!valid || typeof date !== "string") return;
    let cancelled = false;
    void logsForDate(date, email).then((result) => {
      if (cancelled) return;
      setLogs(result.logs);
      setError(result.error);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [date, email, valid]);

  useFocusEffect(loadLogs);

  useEffect(() => {
    let cancelled = false;
    void listBodyParts().then((result) => {
      if (cancelled) return;
      setParts(result.parts);
      setPartsError(result.error);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!valid) {
    return (
      <View style={styles.screen}>
        <Text style={styles.empty}>That date is not valid.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.title}>{date}</Text>
      {loading ? <ActivityIndicator color="#F2C14E" /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && !error && logs.length === 0 ? (
        <Text style={styles.empty}>Nothing logged this day.</Text>
      ) : null}
      {logs.map((log) => (
        <View key={log.id} style={styles.row}>
          <Text style={styles.name}>{log.name}</Text>
          <Text style={styles.detail}>
            {log.sets} sets · {log.reps} reps · {log.weightKg} kg
          </Text>
        </View>
      ))}
      <Text style={styles.section}>Body part</Text>
      {partsError ? <Text style={styles.error}>{partsError}</Text> : null}
      <View style={styles.grid}>
        {parts.map((part) => (
          <Pressable
            key={part.id}
            accessibilityRole="button"
            style={styles.card}
            onPress={() => {
              router.push(`/train/${part.id}?date=${date}`);
            }}
          >
            <Text style={styles.cardLabel}>{labelPart(part.name)}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#14110E",
    padding: 24,
    gap: 12,
  },
  title: {
    color: "#F7F1E8",
    fontSize: 28,
    fontWeight: "700",
  },
  empty: {
    color: "#B7AA9A",
    lineHeight: 22,
  },
  error: {
    color: "#F0A07A",
  },
  row: {
    backgroundColor: "#221C16",
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  name: {
    color: "#F7F1E8",
    fontSize: 16,
    fontWeight: "600",
  },
  detail: {
    color: "#E7D7B8",
  },
  section: {
    color: "#F7F1E8",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: "47%",
    backgroundColor: "#221C16",
    borderRadius: 12,
    minHeight: 88,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  cardLabel: {
    color: "#F2C14E",
    fontSize: 18,
    fontWeight: "700",
  },
});
