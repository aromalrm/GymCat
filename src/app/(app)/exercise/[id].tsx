import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { ExerciseDemo } from "@/components/exercise-demo";
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
    return <ActivityIndicator color="#F2C14E" style={styles.loader} />;
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
      <Text style={styles.title}>{exercise.name}</Text>
      <Text style={styles.muscle}>{labelPart(exercise.bodyPartName)}</Text>
      <ExerciseDemo url={exercise.videoUrl} />
      <Text style={styles.instructions}>{exercise.instructions}</Text>
      <Text style={styles.section}>Log for {date}</Text>
      {mode === "local" ? (
        <Text style={styles.hint}>Saved on this device only.</Text>
      ) : null}
      <TextInput
        keyboardType="number-pad"
        placeholder="Sets"
        placeholderTextColor="#8A8175"
        style={styles.input}
        value={sets}
        onChangeText={setSets}
      />
      <TextInput
        keyboardType="number-pad"
        placeholder="Reps"
        placeholderTextColor="#8A8175"
        style={styles.input}
        value={reps}
        onChangeText={setReps}
      />
      <TextInput
        keyboardType="decimal-pad"
        placeholder="Weight (kg)"
        placeholderTextColor="#8A8175"
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
      />
      {logMessage ? <Text style={styles.hint}>{logMessage}</Text> : null}
      <Pressable
        accessibilityRole="button"
        style={styles.button}
        onPress={() => {
          void saveLog();
        }}
      >
        <Text style={styles.buttonLabel}>Save set</Text>
      </Pressable>
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
    backgroundColor: "#14110E",
  },
  title: {
    color: "#F7F1E8",
    fontSize: 28,
    fontWeight: "700",
  },
  muscle: {
    color: "#E7D7B8",
    fontSize: 16,
  },
  instructions: {
    color: "#F7F1E8",
    lineHeight: 22,
  },
  error: {
    color: "#F0A07A",
  },
  section: {
    color: "#F7F1E8",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 8,
  },
  hint: {
    color: "#E7D7B8",
  },
  input: {
    backgroundColor: "#221C16",
    color: "#F7F1E8",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#F2C14E",
    borderRadius: 12,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonLabel: {
    color: "#1A140C",
    fontWeight: "700",
  },
  log: {
    backgroundColor: "#221C16",
    borderRadius: 12,
    padding: 14,
  },
  logText: {
    color: "#F7F1E8",
  },
});
