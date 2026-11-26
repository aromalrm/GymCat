export const colors = {
  bg: "#0A0A0A",
  surface: "#141414",
  line: "#2A2A2A",
  white: "#FFFFFF",
  muted: "#A3A3A3",
  ink: "#0A0A0A",
};

export const stackOptions = {
  headerStyle: { backgroundColor: colors.bg },
  headerTintColor: colors.white,
  headerTitleStyle: { fontWeight: "700" as const },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: colors.bg },
  animation: "slide_from_right" as const,
};
