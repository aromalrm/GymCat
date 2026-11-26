export const colors = {
  canvas: "#0B0F17",
  surface: "#111827",
  glass: "rgba(17, 24, 39, 0.85)",
  line: "rgba(255, 255, 255, 0.08)",
  text: "#F9FAFB",
  muted: "#94A3B8",
  volt: "#CCFF00",
  ink: "#0B0F17",
  cyan: "#06B6D4",
  emerald: "#10B981",
  error: "#FFB4AB",
};

export const type = {
  display: "SpaceGrotesk_700Bold",
  headline: "SpaceGrotesk_600SemiBold",
  body: "Manrope_400Regular",
  bodyBold: "Manrope_700Bold",
};

export const stackOptions = {
  headerShown: false as const,
  contentStyle: { backgroundColor: colors.canvas },
  animation: "fade" as const,
};
