import type { Gender, Goal } from "@/lib/profile";

/**
 * Mifflin–St Jeor BMR, then a sedentary activity factor (1.2).
 * Onboarding does not collect activity, so the target is a sedentary
 * day plus a goal adjustment the user can edit:
 * cut −500 kcal, maintain unchanged, bulk +300 kcal.
 * "other" uses the midpoint of the male (+5) and female (−161) constants.
 */
const SEDENTARY = 1.2;

export function calorieTarget(input: {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: Gender;
  goal: Goal;
}): number {
  const sexConstant =
    input.gender === "male" ? 5 : input.gender === "female" ? -161 : -78;
  const bmr =
    10 * input.weightKg +
    6.25 * input.heightCm -
    5 * input.age +
    sexConstant;
  const tdee = bmr * SEDENTARY;
  const adjustment =
    input.goal === "cut" ? -500 : input.goal === "bulk" ? 300 : 0;
  return Math.max(800, Math.round(tdee + adjustment));
}
