import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { PressableScale } from "@/components/pressable-scale";

import { colors, type as fonts } from "@/constants/theme";
import { addMeal, mealsForDate, type MealLog } from "@/lib/meal-logs";
import { isIsoDate } from "@/lib/workout-logs";
import { useAuth } from "@/providers/auth-provider";

export default function NutritionScreen() {
  const { email, mode } = useAuth();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [meals, setMeals] = useState<MealLog[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isIsoDate(date)) {
      setMeals([]);
      return;
    }
    const result = await mealsForDate(date, email);
    setMeals(result.meals);
    if (result.error) setMessage(result.error);
  }, [date, email]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  async function save() {
    setMessage(null);
    if (!isIsoDate(date)) {
      setMessage("Use a date like 2026-11-26.");
      return;
    }
    const kcal = Number(calories);
    if (!Number.isInteger(kcal) || kcal < 0) {
      setMessage("Enter total calories as a whole number.");
      return;
    }
    const macros = [protein, carbs, fat].map((value) => {
      if (value.trim() === "") return null;
      const parsed = Number(value);
      if (!Number.isFinite(parsed) || parsed < 0) return Number.NaN;
      return parsed;
    });
    if (macros.some((value) => Number.isNaN(value))) {
      setMessage("Macros must be empty or a number of grams.");
      return;
    }
    const [proteinG, carbsG, fatG] = macros;
    const error = await addMeal({
      email,
      date,
      calories: kcal,
      protein: proteinG ?? null,
      carbs: carbsG ?? null,
      fat: fatG ?? null,
    });
    setMessage(error ?? "Saved.");
    if (!error) {
      setCalories("");
      setProtein("");
      setCarbs("");
      setFat("");
      await load();
    }
  }

  const total = meals.reduce((sum, meal) => sum + meal.calories, 0);

  return (
    <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
      <Text style={styles.kicker}>HYPERTROPHY FUELING PROTOCOL</Text>
      <Text style={styles.headline}>Nutrition & fuel matrix</Text>
      <Text style={styles.lead}>
        Total calories for a day. Protein, carbs, and fat are optional grams.
        {mode === "local" ? " Saved on this device only." : ""}
      </Text>
      <Field label="Date" value={date} onChangeText={setDate} keyboard="default" />
      <Field label="Calories" value={calories} onChangeText={setCalories} keyboard="number-pad" />
      <Field label="Protein (g)" value={protein} onChangeText={setProtein} keyboard="decimal-pad" />
      <Field label="Carbs (g)" value={carbs} onChangeText={setCarbs} keyboard="decimal-pad" />
      <Field label="Fat (g)" value={fat} onChangeText={setFat} keyboard="decimal-pad" />
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <PressableScale
        accessibilityRole="button"
        style={styles.button}
        onPress={() => {
          void save();
        }}
      >
        <Text style={styles.buttonLabel}>LOG FUEL INTAKE</Text>
      </PressableScale>
      <Text style={styles.total}>{isIsoDate(date) ? `${total} kcal on ${date}` : "Invalid date"}</Text>
      {meals.map((meal, index) => (
        <Animated.View
          key={meal.id}
          entering={FadeInDown.delay(index * 40).duration(360)}
          style={styles.row}
        >
          <Text style={styles.rowTitle}>{meal.calories} kcal</Text>
          <Text style={styles.rowMeta}>
            P {meal.protein ?? "–"} · C {meal.carbs ?? "–"} · F {meal.fat ?? "–"}
          </Text>
        </Animated.View>
      ))}
    </ScrollView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  keyboard,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboard: "default" | "number-pad" | "decimal-pad";
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        keyboardType={keyboard}
        placeholderTextColor="#737373"
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
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
    letterSpacing: 1.2,
  },
  headline: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 36,
    letterSpacing: -0.8,
  },
  lead: {
    color: colors.muted,
    fontFamily: fonts.body,
    lineHeight: 22,
  },
  field: {
    gap: 6,
  },
  label: {
    color: colors.muted,
    fontFamily: fonts.headline,
    fontSize: 12,
    letterSpacing: 0.6,
  },
  input: {
    backgroundColor: "#070A10",
    color: colors.text,
    fontFamily: fonts.body,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
  },
  message: {
    color: colors.emerald,
    fontFamily: fonts.body,
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
    fontSize: 14,
  },
  total: {
    color: colors.volt,
    fontFamily: fonts.display,
    fontSize: 36,
    marginTop: 8,
  },
  row: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  rowTitle: {
    color: colors.text,
    fontFamily: fonts.headline,
  },
  rowMeta: {
    color: colors.cyan,
    fontFamily: fonts.body,
  },
});
