import { addLocalMeal, readLocalMeals } from "@/lib/local-logs";
import { supabase } from "@/lib/supabase";

export type MealLog = {
  id: string;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
};

type MealRow = {
  id: string;
  calories: number;
  protein: number | string | null;
  carbs: number | string | null;
  fat: number | string | null;
};

function num(value: number | string | null): number | null {
  if (value == null) return null;
  return Number(value);
}

export async function mealsForDate(
  date: string,
  email: string | null,
): Promise<{ meals: MealLog[]; error: string | null }> {
  if (!supabase) {
    const rows = await readLocalMeals();
    return {
      meals: rows
        .filter((row) => row.email === email && row.date === date)
        .map((row) => ({
          id: row.id,
          calories: row.calories,
          protein: row.protein,
          carbs: row.carbs,
          fat: row.fat,
        })),
      error: null,
    };
  }

  const { data, error } = await supabase
    .from("meal_logs")
    .select("id, calories, protein, carbs, fat")
    .eq("date", date)
    .order("created_at", { ascending: true });

  if (error) return { meals: [], error: error.message };
  return {
    meals: ((data ?? []) as MealRow[]).map((row) => ({
      id: row.id,
      calories: row.calories,
      protein: num(row.protein),
      carbs: num(row.carbs),
      fat: num(row.fat),
    })),
    error: null,
  };
}

export async function addMeal(input: {
  email: string | null;
  date: string;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
}): Promise<string | null> {
  if (!supabase) {
    if (!input.email) return "Sign in before logging a meal.";
    await addLocalMeal({
      email: input.email,
      date: input.date,
      calories: input.calories,
      protein: input.protein,
      carbs: input.carbs,
      fat: input.fat,
    });
    return null;
  }

  const { data } = await supabase.auth.getSession();
  const id = data.session?.user.id;
  if (!id) return "Sign in before logging a meal.";
  const { error } = await supabase.from("meal_logs").insert({
    user_id: id,
    date: input.date,
    calories: input.calories,
    protein: input.protein,
    carbs: input.carbs,
    fat: input.fat,
  });
  return error?.message ?? null;
}
