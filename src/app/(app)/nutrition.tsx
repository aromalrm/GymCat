import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { PressableScale } from "@/components/pressable-scale";

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
      <Text style={styles.headline}>Nutrition</Text>
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
        <Text style={styles.buttonLabel}>Save intake</Text>
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
    backgroundColor: "#0A0A0A",
  },
  headline: {
    color: "#FFFFFF",
    fontSize: 44,
    fontWeight: "800",
    letterSpacing: -1.4,
  },
  lead: {
    color: "#A3A3A3",
    lineHeight: 22,
  },
  field: {
    gap: 6,
  },
  label: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#141414",
    color: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
  },
  message: {
    color: "#FFFFFF",
  },
  button: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonLabel: {
    color: "#0A0A0A",
    fontWeight: "700",
    fontSize: 16,
  },
  total: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
  },
  row: {
    backgroundColor: "#141414",
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  rowTitle: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  rowMeta: {
    color: "#A3A3A3",
  },
});
