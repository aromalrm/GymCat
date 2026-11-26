import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { isIsoDate, logsForDate, type DayLog } from "@/lib/workout-logs";
import { supabase } from "@/lib/supabase";

export default function DayScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const valid = typeof date === "string" && isIsoDate(date);
  const [logs, setLogs] = useState<DayLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(valid);

  useEffect(() => {
    if (!valid || !date) return;
    let cancelled = false;
    void logsForDate(date).then((result) => {
      if (cancelled) return;
      setLogs(result.logs);
      setError(result.error);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [date, valid]);

  if (!valid) {
    return (
      <View style={styles.screen}>
        <Text style={styles.empty}>That date is not valid.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{date}</Text>
      {loading ? <ActivityIndicator color="#F2C14E" /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && !error && logs.length === 0 ? (
        <Text style={styles.empty}>
          {supabase
            ? "Nothing logged this day."
            : "Nothing logged this day. Logs are stored in Supabase once it is configured."}
        </Text>
      ) : null}
      {logs.map((log) => (
        <View key={log.id} style={styles.row}>
          <Text style={styles.name}>{log.name}</Text>
          <Text style={styles.detail}>
            {log.sets} sets · {log.reps} reps · {log.weightKg} kg
          </Text>
        </View>
      ))}
    </View>
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
});
