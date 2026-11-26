import { ProfileForm } from "@/components/profile-form";
import { useAuth } from "@/providers/auth-provider";

export default function ProfileScreen() {
  const { profile } = useAuth();
  if (!profile) return null;

  return (
    <ProfileForm
      initial={profile}
      submitLabel="Save profile"
      lead="Update height, weight, age, gender, goal, and your daily calorie target. The calculated target stays put until you choose to use it again."
    />
  );
}
