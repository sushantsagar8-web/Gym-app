import * as ScreenOrientation from "expo-screen-orientation";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect } from "react";
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { cloudinaryThumbnailUrl } from "@/components/cloudinary-video-player";
import { recordVideoAnalytics } from "@/lib/video-analytics";

export default function PlayerScreen() {
  const params = useLocalSearchParams<{ uri?: string; title?: string; alt?: string }>();
  const uri = params.uri ?? "";
  const title = params.title ?? "Exercise reference";
  const alt = params.alt ?? title;
  const player = useVideoPlayer(uri, (instance) => {
    instance.loop = true;
    instance.muted = true;
    instance.play();
  });

  useEffect(() => {
    if (Platform.OS !== "web") ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(() => undefined);
    void recordVideoAnalytics({ videoUri: uri, event: "view", quality: "auto" });
    return () => { if (Platform.OS !== "web") ScreenOrientation.unlockAsync().catch(() => undefined); };
  }, [uri]);


  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}><Text style={styles.headerAction}>‹ Close</Text></Pressable>
        <Text numberOfLines={1} style={styles.title}>{title}</Text>
        <Text style={styles.headerStatus}>Looping · Muted</Text>
      </View>
      <View style={styles.videoFrame}>
        <Image source={{ uri: cloudinaryThumbnailUrl(uri, 1280) }} accessibilityLabel={alt} style={styles.poster} />
        <VideoView style={styles.video} player={player} contentFit="contain" allowsFullscreen={false} allowsPictureInPicture={false} nativeControls={false} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#071c22", padding: 18 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, paddingBottom: 12 },
  headerAction: { color: "#b7e5c9", fontSize: 14, fontWeight: "700" },
  title: { flex: 1, color: "#ffffff", fontSize: 16, fontWeight: "700", textAlign: "center" },
  headerStatus: { color: "#9cb5b8", fontSize: 11, fontWeight: "600" },
  videoFrame: { flex: 1, minHeight: 220, overflow: "hidden", borderRadius: 20, backgroundColor: "#102f37" },
  video: { flex: 1 },
  poster: { ...StyleSheet.absoluteFillObject, opacity: 0.3 },
});
