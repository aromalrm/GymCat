import AsyncStorage from "@react-native-async-storage/async-storage";

const WORKOUTS_KEY = "gymcat.localWorkouts";
const MEALS_KEY = "gymcat.localMeals";

export type LocalWorkout = {
  id: string;
  email: string;
  date: string;
  exerciseId: string;
  name: string;
  sets: number;
  reps: number;
  weightKg: number;
  createdAt: string;
};

export type LocalMeal = {
  id: string;
  email: string;
  date: string;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  createdAt: string;
};

async function readList<T>(key: string): Promise<T[]> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function readLocalWorkouts(): Promise<LocalWorkout[]> {
  return readList(WORKOUTS_KEY);
}

export async function addLocalWorkout(
  entry: Omit<LocalWorkout, "id" | "createdAt">,
): Promise<LocalWorkout> {
  const all = await readLocalWorkouts();
  const saved: LocalWorkout = {
    ...entry,
    id: globalThis.crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  all.push(saved);
  await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(all));
  return saved;
}

export async function readLocalMeals(): Promise<LocalMeal[]> {
  return readList(MEALS_KEY);
}

export async function addLocalMeal(
  entry: Omit<LocalMeal, "id" | "createdAt">,
): Promise<LocalMeal> {
  const all = await readLocalMeals();
  const saved: LocalMeal = {
    ...entry,
    id: globalThis.crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  all.push(saved);
  await AsyncStorage.setItem(MEALS_KEY, JSON.stringify(all));
  return saved;
}
