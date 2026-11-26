import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { labelPart, listExercises, type Exercise } from "@/lib/catalog";

export default function ExerciseListScreen() {
  const { part, date } = useLocalSearchParams<{ part: string; date?: string }>();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!part) return;
    let cancelled = false;
    void listExercises(part).then((result) => {
      if (cancelled) return;
      setExercises(result.exercises);
      setError(result.error);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [part]);

  const title = exercises[0] ? labelPart(exercises[0].bodyPartName) : "Exercises";

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.title}>{title}</Text>
      {typeof date === "string" ? (
        <Text style={styles.meta}>For {date}</Text>
      ) : null}
      {loading ? <ActivityIndicator color="#F2C14E" /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && !error && exercises.length === 0 ? (
        <Text style={styles.meta}>No exercises for this body part.</Text>
      ) : null}
      {exercises.map((exercise) => (
        <Pressable
          key={exercise.id}
          accessibilityRole="button"
          style={styles.card}
          onPress={() => {
            router.push(`/exercise/${exercise.id}`);
          }}
        >
          {exercise.thumbnailUrl ? (
            <Image
              source={{ uri: exercise.thumbnailUrl }}
              style={styles.thumb}
              contentFit="cover"
            />
          ) : (
            <View style={styles.thumb}>
              <Text style={styles.thumbLetter}>{exercise.name.slice(0, 1)}</Text>
            </View>
          )}
          <View style={styles.copy}>
            <Text style={styles.name}>{exercise.name}</Text>
            <Text style={styles.muscle}>{labelPart(exercise.bodyPartName)}</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  meta: {
    color: "#B7AA9A",
  },
  error: {
    color: "#F0A07A",
  },
  card: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    backgroundColor: "#221C16",
    borderRadius: 12,
    padding: 12,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: "#3A3126",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbLetter: {
    color: "#F2C14E",
    fontSize: 22,
    fontWeight: "700",
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: "#F7F1E8",
    fontSize: 16,
    fontWeight: "600",
  },
  muscle: {
    color: "#E7D7B8",
  },
});
