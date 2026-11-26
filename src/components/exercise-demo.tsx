import { useVideoPlayer, VideoView } from "expo-video";
import * as WebBrowser from "expo-web-browser";
import { StyleSheet, Text, View } from "react-native";

import { PressableScale } from "@/components/pressable-scale";

import { isVideoFileUrl } from "@/lib/catalog";

export function ExerciseDemo({ url }: { url: string }) {
  if (isVideoFileUrl(url)) {
    return <VideoFile url={url} />;
  }

  return (
    <View style={styles.box}>
      <Text style={styles.copy}>
        This demo is a post, not a video file, so it plays in the browser. Swap
        the exercise video URL for an mp4 when you have one.
      </Text>
      <PressableScale
        accessibilityRole="button"
        style={styles.button}
        onPress={() => {
          void WebBrowser.openBrowserAsync(url);
        }}
      >
        <Text style={styles.buttonLabel}>Open demo post</Text>
      </PressableScale>
    </View>
  );
}

function VideoFile({ url }: { url: string }) {
  const player = useVideoPlayer(url, (next) => {
    next.loop = true;
  });

  return (
    <VideoView
      player={player}
      style={styles.video}
      nativeControls
      contentFit="contain"
    />
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#141414",
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  copy: {
    color: "#A3A3A3",
    lineHeight: 22,
  },
  button: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonLabel: {
    color: "#0A0A0A",
    fontWeight: "700",
  },
  video: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    borderRadius: 12,
  },
});
