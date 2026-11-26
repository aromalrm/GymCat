import { Calendar, type DateData } from "react-native-calendars";
import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { PressableScale } from "@/components/pressable-scale";
import { workoutDatesInMonth } from "@/lib/workout-logs";
import { useAuth } from "@/providers/auth-provider";

const GOLD = "#FFFFFF";

export default function HomeScreen() {
  const { email, profile, mode, signOut } = useAuth();
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const [marks, setMarks] = useState<Record<string, { marked: true; dotColor: string }>>(
    {},
  );
  const [error, setError] = useState<string | null>(null);

  const loadMonth = useCallback(async (year: number, month: number) => {
    const { dates, error: loadError } = await workoutDatesInMonth(year, month, email);
    setError(loadError);
    const next: Record<string, { marked: true; dotColor: string }> = {};
    for (const date of dates) {
      next[date] = { marked: true, dotColor: GOLD };
    }
    setMarks(next);
  }, [email]);

  useFocusEffect(
    useCallback(() => {
      const [year, month] = today.split("-").map(Number);
      if (year && month) void loadMonth(year, month);
    }, [loadMonth, today]),
  );

  return (
    <View style={styles.screen}>
      <Animated.View entering={FadeInDown.duration(420)} style={styles.header}>
        <Text style={styles.kicker}>{email}</Text>
        <Text style={styles.headline}>Train</Text>
        {profile ? (
          <Text style={styles.meta}>{profile.calorieTarget} kcal target</Text>
        ) : null}
        <View style={styles.actions}>
          <PressableScale
            accessibilityRole="button"
            style={styles.pill}
            onPress={() => {
              router.push("/profile");
            }}
          >
            <Text style={styles.pillLabel}>Profile</Text>
          </PressableScale>
          <PressableScale
            accessibilityRole="button"
            style={styles.pill}
            onPress={() => {
              router.push("/nutrition");
            }}
          >
            <Text style={styles.pillLabel}>Nutrition</Text>
          </PressableScale>
          <PressableScale
            accessibilityRole="button"
            style={styles.pillGhost}
            onPress={() => {
              void signOut();
            }}
          >
            <Text style={styles.pillGhostLabel}>Log out</Text>
          </PressableScale>
        </View>
      </Animated.View>
      {mode === "local" ? (
        <Text style={styles.note}>Workout and meal logs stay on this device.</Text>
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Animated.View entering={FadeInDown.delay(80).duration(480)}>
      <Calendar
        current={today}
        markedDates={marks}
        onDayPress={(day: DateData) => {
          router.push(`/day/${day.dateString}`);
        }}
        onMonthChange={(month: DateData) => {
          void loadMonth(month.year, month.month);
        }}
        onVisibleMonthsChange={(months: DateData[]) => {
          const month = months[0];
          if (month) void loadMonth(month.year, month.month);
        }}
        theme={{
          calendarBackground: "#0A0A0A",
          backgroundColor: "#0A0A0A",
          dayTextColor: "#FFFFFF",
          monthTextColor: "#FFFFFF",
          textDisabledColor: "#3A3A3A",
          textSectionTitleColor: "#A3A3A3",
          arrowColor: GOLD,
          todayTextColor: GOLD,
          selectedDayBackgroundColor: GOLD,
          selectedDayTextColor: "#0A0A0A",
        }}
      />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 6,
  },
  kicker: {
    color: "#A3A3A3",
    fontSize: 13,
    fontWeight: "600",
  },
  headline: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "800",
    letterSpacing: -1.6,
    lineHeight: 50,
  },
  meta: {
    color: "#A3A3A3",
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  pill: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  pillLabel: {
    color: "#0A0A0A",
    fontWeight: "700",
  },
  pillGhost: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  pillGhostLabel: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  note: {
    color: "#A3A3A3",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  error: {
    color: "#FFFFFF",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
});
