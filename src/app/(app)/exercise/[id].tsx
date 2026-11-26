import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { PressableScale } from "@/components/pressable-scale";

import { ExerciseDemo } from "@/components/exercise-demo";
import { colors, type as fonts } from "@/constants/theme";
import { getExercise, labelPart, type Exercise } from "@/lib/catalog";
import { addWorkout, isIsoDate, logsForDate, type DayLog } from "@/lib/workout-logs";
import { useAuth } from "@/providers/auth-provider";

export default function ExerciseDetailScreen() {
  const { id, date: dateParam } = useLocalSearchParams<{ id: string; date?: string }>();
  const { email, mode } = useAuth();
  const date =
    typeof dateParam === "string" && isIsoDate(dateParam)
      ? dateParam
      : new Date().toISOString().slice(0, 10);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [logs, setLogs] = useState<DayLog[]>([]);
  const [logMessage, setLogMessage] = useState<string | null>(null);

  const loadLogs = useCallback(async () => {
    if (!id) return;
    const result = await logsForDate(date, email);
    setLogs(result.logs.filter((log) => log.exerciseId === id));
    if (result.error) setLogMessage(result.error);
  }, [date, email, id]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    void getExercise(id).then((result) => {
      if (cancelled) return;
      setExercise(result.exercise);
      setError(result.error);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void loadLogs();
    }, [loadLogs]),
  );

  async function saveLog() {
    if (!exercise) return;
    setLogMessage(null);
    const setCount = Number(sets);
    const repCount = Number(reps);
    const weightKg = Number(weight);
    if (!Number.isInteger(setCount) || setCount < 1) {
      setLogMessage("Sets must be a whole number above 0.");
      return;
    }
    if (!Number.isInteger(repCount) || repCount < 1) {
      setLogMessage("Reps must be a whole number above 0.");
      return;
    }
    if (!Number.isFinite(weightKg) || weightKg < 0) {
      setLogMessage("Weight must be 0 or more kilograms.");
      return;
    }
    const saveError = await addWorkout({
      email,
      date,
      exerciseId: exercise.id,
      name: exercise.name,
      sets: setCount,
      reps: repCount,
      weightKg,
    });
    setLogMessage(saveError ?? "Saved.");
    if (!saveError) {
      setSets("");
      setReps("");
      setWeight("");
      await loadLogs();
    }
  }

  if (loading) {
    return <ActivityIndicator color="#FFFFFF" style={styles.loader} />;
  }

  if (error || !exercise) {
    return (
      <ScrollView contentContainerStyle={styles.screen}>
        <Text style={styles.error}>{error ?? "Exercise not found."}</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.kicker}>KINETIC NODE  ·  {labelPart(exercise.bodyPartName).toUpperCase()}</Text>
      <Text style={styles.title}>{exercise.name}</Text>
      <View style={styles.viewport}>
        <View style={styles.figureHead} />
        <View style={styles.figureTorso} />
        <Text style={styles.viewportNote}>Static form guide. Swap in a video file to play it here.</Text>
      </View>
      <ExerciseDemo url={exercise.videoUrl} />
      <Text style={styles.instructions}>{exercise.instructions}</Text>
      <Text style={styles.section}>Log set  ·  {date}</Text>
      {mode === "local" ? (
        <Text style={styles.hint}>Saved on this device only.</Text>
      ) : null}
      <TextInput
        keyboardType="number-pad"
        placeholder="Sets"
        placeholderTextColor="#737373"
        style={styles.input}
        value={sets}
        onChangeText={setSets}
      />
      <TextInput
        keyboardType="number-pad"
        placeholder="Reps"
        placeholderTextColor="#737373"
        style={styles.input}
        value={reps}
        onChangeText={setReps}
      />
      <TextInput
        keyboardType="decimal-pad"
        placeholder="Weight (kg)"
        placeholderTextColor="#737373"
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
      />
      {logMessage ? <Text style={styles.hint}>{logMessage}</Text> : null}
      <PressableScale
        accessibilityRole="button"
        style={styles.button}
        onPress={() => {
          void saveLog();
        }}
      >
        <Text style={styles.buttonLabel}>SAVE SET</Text>
      </PressableScale>
      {logs.length === 0 ? (
        <Text style={styles.hint}>Nothing logged for this exercise on this date.</Text>
      ) : (
        logs.map((log) => (
          <View key={log.id} style={styles.log}>
            <Text style={styles.logText}>
              {log.sets} sets · {log.reps} reps · {log.weightKg} kg
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: {
    marginTop: 48,
  },
  screen: {
    padding: 24,
    gap: 12,
    backgroundColor: colors.canvas,
  },
  kicker: {
    color: colors.volt,
    fontFamily: fonts.headline,
    fontSize: 11,
    letterSpacing: 1.2,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 34,
    letterSpacing: -0.6,
  },
  viewport: {
    minHeight: 200,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  figureHead: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.cyan,
  },
  figureTorso: {
    width: 90,
    height: 70,
    borderWidth: 2,
    borderColor: colors.volt,
    borderRadius: 24,
  },
  viewportNote: { color: colors.muted, fontFamily: fonts.body, fontSize: 12 },
  instructions: {
    color: colors.text,
    fontFamily: fonts.body,
    lineHeight: 22,
  },
  error: {
    color: colors.error,
    fontFamily: fonts.body,
  },
  section: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 22,
    marginTop: 8,
  },
  hint: {
    color: colors.muted,
    fontFamily: fonts.body,
  },
  input: {
    backgroundColor: "#070A10",
    color: colors.text,
    fontFamily: fonts.body,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.volt,
    borderRadius: 999,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonLabel: {
    color: colors.ink,
    fontFamily: fonts.headline,
    letterSpacing: 1,
  },
  log: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
  },
  logText: {
    color: colors.text,
    fontFamily: fonts.body,
  },
});
