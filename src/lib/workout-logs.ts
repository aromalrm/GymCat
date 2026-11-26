import { addLocalWorkout, readLocalWorkouts } from "@/lib/local-logs";
import { supabase } from "@/lib/supabase";

export type DayLog = {
  id: string;
  exerciseId: string;
  name: string;
  sets: number;
  reps: number;
  weightKg: number;
};

type LogRow = {
  id: string;
  exercise_id: string;
  date: string;
  sets: number;
  reps: number;
  weight_kg: number | string;
  exercises: { name: string } | { name: string }[] | null;
};

function exerciseName(row: LogRow): string {
  const joined = row.exercises;
  if (!joined) return "Exercise";
  if (Array.isArray(joined)) return joined[0]?.name ?? "Exercise";
  return joined.name;
}

async function userId(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

export async function workoutDatesInMonth(
  year: number,
  month: number,
  email: string | null,
): Promise<{ dates: string[]; error: string | null }> {
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const end = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

  if (!supabase) {
    const rows = await readLocalWorkouts();
    const dates = [
      ...new Set(
        rows
          .filter((row) => row.email === email && row.date >= start && row.date <= end)
          .map((row) => row.date),
      ),
    ];
    return { dates, error: null };
  }

  const { data, error } = await supabase
    .from("workout_logs")
    .select("date")
    .gte("date", start)
    .lte("date", end);

  if (error) return { dates: [], error: error.message };
  const dates = [
    ...new Set((data ?? []).map((row) => String((row as { date: string }).date))),
  ];
  return { dates, error: null };
}

export async function logsForDate(
  date: string,
  email: string | null,
): Promise<{ logs: DayLog[]; error: string | null }> {
  if (!supabase) {
    const rows = await readLocalWorkouts();
    const logs = rows
      .filter((row) => row.email === email && row.date === date)
      .map((row) => ({
        id: row.id,
        exerciseId: row.exerciseId,
        name: row.name,
        sets: row.sets,
        reps: row.reps,
        weightKg: row.weightKg,
      }));
    return { logs, error: null };
  }

  const { data, error } = await supabase
    .from("workout_logs")
    .select("id, exercise_id, date, sets, reps, weight_kg, exercises(name)")
    .eq("date", date)
    .order("created_at", { ascending: true });

  if (error) return { logs: [], error: error.message };

  const logs = ((data ?? []) as LogRow[]).map((row) => ({
    id: row.id,
    exerciseId: row.exercise_id,
    name: exerciseName(row),
    sets: row.sets,
    reps: row.reps,
    weightKg: Number(row.weight_kg),
  }));
  return { logs, error: null };
}

export async function addWorkout(input: {
  email: string | null;
  date: string;
  exerciseId: string;
  name: string;
  sets: number;
  reps: number;
  weightKg: number;
}): Promise<string | null> {
  if (!supabase) {
    if (!input.email) return "Sign in before logging a workout.";
    await addLocalWorkout({
      email: input.email,
      date: input.date,
      exerciseId: input.exerciseId,
      name: input.name,
      sets: input.sets,
      reps: input.reps,
      weightKg: input.weightKg,
    });
    return null;
  }

  const id = await userId();
  if (!id) return "Sign in before logging a workout.";
  const { error } = await supabase.from("workout_logs").insert({
    user_id: id,
    date: input.date,
    exercise_id: input.exerciseId,
    sets: input.sets,
    reps: input.reps,
    weight_kg: input.weightKg,
  });
  return error?.message ?? null;
}

export function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
