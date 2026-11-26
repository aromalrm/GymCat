import { Calendar, type DateData } from "react-native-calendars";
import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { workoutDatesInMonth } from "@/lib/workout-logs";
import { useAuth } from "@/providers/auth-provider";

const GOLD = "#F2C14E";

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
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.email}>{email}</Text>
          {profile ? (
            <Text style={styles.meta}>{profile.calorieTarget} kcal</Text>
          ) : null}
        </View>
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              router.push("/profile");
            }}
          >
            <Text style={styles.logout}>Profile</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              router.push("/nutrition");
            }}
          >
            <Text style={styles.logout}>Nutrition</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              void signOut();
            }}
          >
            <Text style={styles.logout}>Log out</Text>
          </Pressable>
        </View>
      </View>
      {mode === "local" ? (
        <Text style={styles.note}>Workout and meal logs stay on this device.</Text>
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
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
          calendarBackground: "#14110E",
          backgroundColor: "#14110E",
          dayTextColor: "#F7F1E8",
          monthTextColor: "#F7F1E8",
          textDisabledColor: "#5C5348",
          textSectionTitleColor: "#B7AA9A",
          arrowColor: GOLD,
          todayTextColor: GOLD,
          selectedDayBackgroundColor: GOLD,
          selectedDayTextColor: "#1A140C",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#14110E",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerText: {
    gap: 2,
  },
  email: {
    color: "#F7F1E8",
    fontWeight: "600",
  },
  meta: {
    color: "#E7D7B8",
  },
  actions: {
    flexDirection: "row",
    gap: 16,
  },
  logout: {
    color: "#F2C14E",
    fontWeight: "600",
  },
  note: {
    color: "#B7AA9A",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  error: {
    color: "#F0A07A",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
});
