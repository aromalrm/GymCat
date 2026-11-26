import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { PressableScale } from "@/components/pressable-scale";

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
      {loading ? <ActivityIndicator color="#FFFFFF" /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && !error && logs.length === 0 ? (
        <Text style={styles.empty}>Nothing logged this day.</Text>
      ) : null}
      {logs.map((log, index) => (
        <Animated.View
          key={log.id}
          entering={FadeInDown.delay(index * 40).duration(380)}
          style={styles.row}
        >
          <Text style={styles.name}>{log.name}</Text>
          <Text style={styles.detail}>
            {log.sets} sets · {log.reps} reps · {log.weightKg} kg
          </Text>
        </Animated.View>
      ))}
      <Text style={styles.section}>Body part</Text>
      {partsError ? <Text style={styles.error}>{partsError}</Text> : null}
      <View style={styles.grid}>
        {parts.map((part, index) => (
          <Animated.View
            key={part.id}
            entering={FadeInDown.delay(80 + index * 50).duration(420)}
            style={styles.cardWrap}
          >
            <PressableScale
              accessibilityRole="button"
              style={styles.card}
              onPress={() => {
                router.push(`/train/${part.id}?date=${date}`);
              }}
            >
              <Text style={styles.cardIndex}>0{index + 1}</Text>
              <Text style={styles.cardLabel}>{labelPart(part.name)}</Text>
            </PressableScale>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    padding: 24,
    gap: 12,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 44,
    fontWeight: "800",
    letterSpacing: -1.4,
  },
  empty: {
    color: "#A3A3A3",
    lineHeight: 22,
  },
  error: {
    color: "#FFFFFF",
  },
  row: {
    backgroundColor: "#141414",
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  detail: {
    color: "#A3A3A3",
  },
  section: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.8,
    marginTop: 16,
  },
  grid: {
    gap: 10,
  },
  cardWrap: {
    width: "100%",
  },
  card: {
    backgroundColor: "#141414",
    borderRadius: 20,
    minHeight: 112,
    justifyContent: "flex-end",
    padding: 18,
    gap: 4,
  },
  cardIndex: {
    color: "#A3A3A3",
    fontWeight: "700",
  },
  cardLabel: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -1,
  },
});
