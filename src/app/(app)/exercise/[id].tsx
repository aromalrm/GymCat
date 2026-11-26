import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text } from "react-native";

import { ExerciseDemo } from "@/components/exercise-demo";
import { getExercise, labelPart, type Exercise } from "@/lib/catalog";

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
});
