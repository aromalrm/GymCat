import type { SupabaseClient } from "@supabase/supabase-js";

import { profileSchema, type Profile } from "@/lib/profile";

type ProfileRow = {
  height_cm: number | string | null;
  weight_kg: number | string | null;
  age: number | null;
  gender: string | null;
  goal: string | null;
  calorie_target: number | null;
};

function fromRow(row: ProfileRow | null): Profile | null {
  if (!row) return null;
  const candidate = {
    heightCm: row.height_cm,
    weightKg: row.weight_kg,
    age: row.age,
    gender: row.gender,
    goal: row.goal,
    calorieTarget: row.calorie_target,
  };
  const parsed = profileSchema.safeParse(candidate);
  return parsed.success ? parsed.data : null;
}

export async function fetchProfile(
  client: SupabaseClient,
  userId: string,
): Promise<{ profile: Profile | null; error: string | null }> {
  const { data, error } = await client
    .from("users")
    .select("height_cm, weight_kg, age, gender, goal, calorie_target")
    .eq("id", userId)
    .maybeSingle();

  if (error) return { profile: null, error: error.message };
  return { profile: fromRow(data as ProfileRow | null), error: null };
}

export async function saveProfile(
  client: SupabaseClient,
  userId: string,
  profile: Profile,
): Promise<string | null> {
  const { data, error } = await client
    .from("users")
    .update({
      height_cm: profile.heightCm,
      weight_kg: profile.weightKg,
      age: profile.age,
      gender: profile.gender,
      goal: profile.goal,
      calorie_target: profile.calorieTarget,
    })
    .eq("id", userId)
    .select("id");

  if (error) return error.message;
  if (!data || data.length === 0) {
    return "No profile row for this account. Apply the SQL migration so sign-up creates one.";
  }
  return null;
}
