import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { PressableScale } from "@/components/pressable-scale";

import { colors, type as fonts } from "@/constants/theme";
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
      <Text style={styles.kicker}>BIOMECHANICAL TRAJECTORY CATALOG</Text>
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
            <Text style={styles.muscle}>{labelPart(exercise.bodyPartName).toUpperCase()}</Text>
            <Text style={styles.open}>OPEN</Text>
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
    backgroundColor: colors.canvas,
  },
  kicker: {
    color: colors.volt,
    fontFamily: fonts.headline,
    fontSize: 11,
    letterSpacing: 1.4,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 36,
    letterSpacing: -0.8,
  },
  meta: {
    color: colors.muted,
    fontFamily: fonts.body,
  },
  error: {
    color: colors.error,
    fontFamily: fonts.body,
  },
  card: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
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
    color: colors.volt,
    fontFamily: fonts.display,
    fontSize: 22,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: colors.text,
    fontFamily: fonts.headline,
    fontSize: 18,
  },
  muscle: {
    color: colors.cyan,
    fontFamily: fonts.headline,
    fontSize: 11,
    letterSpacing: 1,
  },
  open: {
    alignSelf: "flex-start",
    marginTop: 6,
    backgroundColor: colors.volt,
    color: colors.ink,
    fontFamily: fonts.headline,
    fontSize: 11,
    letterSpacing: 0.8,
    overflow: "hidden",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
