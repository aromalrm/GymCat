import { ProfileForm } from "@/components/profile-form";

export default function OnboardingScreen() {
  return (
    <ProfileForm
      submitLabel="Save and continue"
      lead="Metric only. We estimate a daily calorie target with Mifflin–St Jeor for a sedentary day, then adjust it for your goal. You can change the number before you finish."
    />
  );
}
