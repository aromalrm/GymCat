import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, type ReactNode } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { PressableScale } from "@/components/pressable-scale";

import { calorieTarget } from "@/lib/calories";
import { profileSchema, type Gender, type Goal, type Profile } from "@/lib/profile";
import { useAuth } from "@/providers/auth-provider";

const genders: { value: Gender; label: string }[] = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Other" },
];

const goals: { value: Goal; label: string }[] = [
  { value: "cut", label: "Cut" },
  { value: "maintain", label: "Maintain" },
  { value: "bulk", label: "Bulk" },
];

export function ProfileForm({
  initial,
  submitLabel,
  lead,
}: {
  initial?: Profile;
  submitLabel: string;
  lead: string;
}) {
  const { saveProfile, mode } = useAuth();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [calorieEdited, setCalorieEdited] = useState(Boolean(initial));

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      heightCm: initial ? String(initial.heightCm) : "",
      weightKg: initial ? String(initial.weightKg) : "",
      age: initial ? String(initial.age) : "",
      gender: initial?.gender,
      goal: initial?.goal,
      calorieTarget: initial ? String(initial.calorieTarget) : "",
    },
  });

  const heightCm = useWatch({ control, name: "heightCm" });
  const weightKg = useWatch({ control, name: "weightKg" });
  const age = useWatch({ control, name: "age" });
  const gender = useWatch({ control, name: "gender" });
  const goal = useWatch({ control, name: "goal" });

  const stats = profileSchema
    .pick({ heightCm: true, weightKg: true, age: true, gender: true, goal: true })
    .safeParse({ heightCm, weightKg, age, gender, goal });
  const suggestion = stats.success ? calorieTarget(stats.data) : null;

  useEffect(() => {
    if (suggestion == null || calorieEdited) return;
    setValue("calorieTarget", suggestion, { shouldValidate: true });
  }, [suggestion, calorieEdited, setValue]);

  async function onSubmit(values: Profile) {
    setBusy(true);
    setSaveError(null);
    setSaved(false);
    const error = await saveProfile(values);
    setSaveError(error);
    setSaved(error == null);
    setBusy(false);
  }

  return (
    <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
      <Animated.View entering={FadeInDown.duration(420)}>
        <Text style={styles.headline}>Your body</Text>
        <Text style={styles.lead}>{lead}</Text>
      </Animated.View>
      {mode === "local" ? (
        <Text style={styles.banner}>
          Saved on this device only until Supabase is configured.
        </Text>
      ) : null}
      <Field label="Height (cm)" error={errors.heightCm?.message}>
        <Controller
          control={control}
          name="heightCm"
          render={({ field }) => (
            <TextInput
              keyboardType="decimal-pad"
              placeholder="170"
              placeholderTextColor="#737373"
              style={styles.input}
              value={field.value == null ? "" : String(field.value)}
              onChangeText={field.onChange}
            />
          )}
        />
      </Field>
      <Field label="Weight (kg)" error={errors.weightKg?.message}>
        <Controller
          control={control}
          name="weightKg"
          render={({ field }) => (
            <TextInput
              keyboardType="decimal-pad"
              placeholder="70"
              placeholderTextColor="#737373"
              style={styles.input}
              value={field.value == null ? "" : String(field.value)}
              onChangeText={field.onChange}
            />
          )}
        />
      </Field>
      <Field label="Age" error={errors.age?.message}>
        <Controller
          control={control}
          name="age"
          render={({ field }) => (
            <TextInput
              keyboardType="number-pad"
              placeholder="28"
              placeholderTextColor="#737373"
              style={styles.input}
              value={field.value == null ? "" : String(field.value)}
              onChangeText={field.onChange}
            />
          )}
        />
      </Field>
      <Field label="Gender" error={errors.gender?.message}>
        <Controller
          control={control}
          name="gender"
          render={({ field }) => (
            <ChoiceRow options={genders} value={field.value} onChange={field.onChange} />
          )}
        />
      </Field>
      <Field label="Goal" error={errors.goal?.message}>
        <Controller
          control={control}
          name="goal"
          render={({ field }) => (
            <ChoiceRow options={goals} value={field.value} onChange={field.onChange} />
          )}
        />
      </Field>
      <Field label="Daily calories" error={errors.calorieTarget?.message}>
        <Controller
          control={control}
          name="calorieTarget"
          render={({ field }) => (
            <TextInput
              keyboardType="number-pad"
              placeholder={stats.success ? "Calculated" : "Fill in your stats"}
              placeholderTextColor="#737373"
              style={styles.input}
              value={field.value == null ? "" : String(field.value)}
              onChangeText={(text) => {
                setCalorieEdited(true);
                field.onChange(text);
              }}
            />
          )}
        />
      </Field>
      {stats.success && calorieEdited ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setCalorieEdited(false);
          }}
        >
          <Text style={styles.link}>Use the calculated target again</Text>
        </Pressable>
      ) : null}
      {saveError ? <Text style={styles.error}>{saveError}</Text> : null}
      {saved ? <Text style={styles.saved}>Saved.</Text> : null}
      <PressableScale
        accessibilityRole="button"
        disabled={busy}
        style={styles.button}
        onPress={() => {
          void handleSubmit(onSubmit)();
        }}
      >
        {busy ? (
          <ActivityIndicator color="#0A0A0A" />
        ) : (
          <Text style={styles.buttonLabel}>{submitLabel}</Text>
        )}
      </PressableScale>
    </ScrollView>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

function ChoiceRow<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T | undefined;
  onChange: (value: T) => void;
}) {
  return (
    <View style={styles.choices}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={[styles.choice, selected && styles.choiceSelected]}
            onPress={() => {
              onChange(option.value);
            }}
          >
            <Text style={[styles.choiceLabel, selected && styles.choiceLabelSelected]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 24,
    gap: 14,
    backgroundColor: "#0A0A0A",
  },
  headline: {
    color: "#FFFFFF",
    fontSize: 44,
    fontWeight: "800",
    letterSpacing: -1.4,
    marginBottom: 8,
  },
  lead: {
    color: "#A3A3A3",
    lineHeight: 22,
  },
  banner: {
    color: "#A3A3A3",
    backgroundColor: "#141414",
    padding: 12,
    borderRadius: 12,
  },
  field: { gap: 6 },
  label: { color: "#FFFFFF", fontWeight: "600" },
  input: {
    backgroundColor: "#141414",
    color: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
  },
  choices: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  choice: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#141414",
  },
  choiceSelected: { backgroundColor: "#FFFFFF" },
  choiceLabel: { color: "#FFFFFF", fontWeight: "600" },
  choiceLabelSelected: { color: "#0A0A0A" },
  error: { color: "#FFFFFF" },
  saved: { color: "#FFFFFF" },
  link: { color: "#FFFFFF" },
  button: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonLabel: { color: "#0A0A0A", fontSize: 16, fontWeight: "700" },
});
