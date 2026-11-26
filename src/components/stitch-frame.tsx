import { StyleSheet, Text, View } from "react-native";

export function StitchFrame({ src }: { src: string }) {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Open the web app to view {src}.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0B0F17",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  text: { color: "#F9FAFB" },
});
