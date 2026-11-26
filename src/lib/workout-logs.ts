import { supabase } from "@/lib/supabase";

export type DayLog = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weightKg: number;
};

type LogRow = {
  id: string;
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

export async function workoutDatesInMonth(
  year: number,
  month: number,
): Promise<{ dates: string[]; error: string | null }> {
  if (!supabase) return { dates: [], error: null };

  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const end = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

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
): Promise<{ logs: DayLog[]; error: string | null }> {
  if (!supabase) return { logs: [], error: null };

  const { data, error } = await supabase
    .from("workout_logs")
    .select("id, date, sets, reps, weight_kg, exercises(name)")
    .eq("date", date)
    .order("created_at", { ascending: true });

  if (error) return { logs: [], error: error.message };

  const logs = ((data ?? []) as LogRow[]).map((row) => ({
    id: row.id,
    name: exerciseName(row),
    sets: row.sets,
    reps: row.reps,
    weightKg: Number(row.weight_kg),
  }));
  return { logs, error: null };
}

export function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
