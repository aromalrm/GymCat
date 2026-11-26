import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { PressableScale } from "@/components/pressable-scale";

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
      {loading ? <ActivityIndicator color="#FFFFFF" /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && !error && exercises.length === 0 ? (
        <Text style={styles.meta}>No exercises for this body part.</Text>
      ) : null}
      {exercises.map((exercise, index) => (
        <Animated.View key={exercise.id} entering={FadeInDown.delay(index * 45).duration(400)}>
        <PressableScale
          accessibilityRole="button"
          style={styles.card}
          onPress={() => {
            const query = typeof date === "string" ? `?date=${date}` : "";
            router.push(`/exercise/${exercise.id}${query}`);
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
        </PressableScale>
        </Animated.View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 24,
    gap: 12,
    backgroundColor: "#0A0A0A",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 44,
    fontWeight: "800",
    letterSpacing: -1.4,
  },
  meta: {
    color: "#A3A3A3",
  },
  error: {
    color: "#FFFFFF",
  },
  card: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    backgroundColor: "#141414",
    borderRadius: 12,
    padding: 12,
  },
  thumb: {
    width: 84,
    height: 84,
    borderRadius: 16,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbLetter: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  muscle: {
    color: "#A3A3A3",
  },
});
