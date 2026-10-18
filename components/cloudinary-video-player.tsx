import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useMemo, useState } from "react";
import { Image, StyleSheet, View, useWindowDimensions } from "react-native";

export function cloudinaryThumbnailUrl(videoUrl: string, width = 720) {
  return videoUrl.replace("/video/upload/", `/video/upload/so_50p,w_${width},c_fill,q_auto,f_jpg/`).replace(/\.mp4($|\?)/, ".jpg$1");
}

type CloudinaryVideoPlayerProps = {
  uri: string;
  altText: string;
  autoPlay?: boolean;
  loop?: boolean;
  compact?: boolean;
  immersive?: boolean;
  shouldPlay?: boolean;
};

export function CloudinaryVideoPlayer({ uri, altText: _altText, autoPlay = false, loop = true, compact = false, immersive = false, shouldPlay = autoPlay }: CloudinaryVideoPlayerProps) {
  const { width, height: windowHeight } = useWindowDimensions();
  const isLandscape = width > windowHeight;
  const responsiveHeight = immersive
    ? isLandscape
      ? Math.min(340, Math.max(220, Math.round(windowHeight * 0.72)))
      : Math.min(360, Math.max(220, Math.round(width * 0.72)))
    : compact ? 220 : 250;
  const player = useVideoPlayer(uri, (instance) => {
    instance.loop = loop;
    instance.muted = true;
    if (autoPlay) instance.play();
  });
  const [showThumbnail, setShowThumbnail] = useState(true);
  const thumbnail = useMemo(() => cloudinaryThumbnailUrl(uri), [uri]);

  useEffect(() => {
    player.muted = true;
    if (shouldPlay) player.play();
    else player.pause();
  }, [player, shouldPlay]);

  useEffect(() => {
    const subscription = player.addListener("statusChange", ({ status }) => {
      if (status === "readyToPlay") setShowThumbnail(false);
    });
    return () => subscription.remove();
  }, [player]);

  return (
    <View style={[styles.container, compact && styles.compactContainer, immersive && styles.immersiveContainer, { height: responsiveHeight }]}>
      <VideoView style={styles.video} player={player} contentFit="cover" allowsFullscreen={false} allowsPictureInPicture={false} nativeControls={false} />
      {showThumbnail && <Image source={{ uri: thumbnail }} style={StyleSheet.absoluteFill} resizeMode="cover" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 250, width: "100%", overflow: "hidden", borderRadius: 26, backgroundColor: "#12313b" },
  compactContainer: { height: 220 },
  immersiveContainer: { borderRadius: 18 },
  video: { width: "100%", height: "100%" },
});
