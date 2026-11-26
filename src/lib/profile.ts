import { z } from "zod";

export const genderSchema = z.enum(["female", "male", "other"]);
export const goalSchema = z.enum(["cut", "maintain", "bulk"]);

export type Gender = z.infer<typeof genderSchema>;
export type Goal = z.infer<typeof goalSchema>;

export const profileSchema = z.object({
  heightCm: z.coerce
    .number({ error: "Enter height in cm." })
    .min(100, "Height must be at least 100 cm.")
    .max(250, "Height must be at most 250 cm."),
  weightKg: z.coerce
    .number({ error: "Enter weight in kg." })
    .min(30, "Weight must be at least 30 kg.")
    .max(300, "Weight must be at most 300 kg."),
  age: z.coerce
    .number({ error: "Enter age." })
    .int("Age must be a whole number.")
    .min(13, "Age must be at least 13.")
    .max(120, "Age must be at most 120."),
  gender: genderSchema,
  goal: goalSchema,
  calorieTarget: z.coerce
    .number({ error: "Enter a calorie target." })
    .int("Calories must be a whole number.")
    .min(800, "Calorie target must be at least 800.")
    .max(8000, "Calorie target must be at most 8000."),
});

export type Profile = z.infer<typeof profileSchema>;

export function parseProfile(value: unknown): Profile | null {
  const parsed = profileSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}
