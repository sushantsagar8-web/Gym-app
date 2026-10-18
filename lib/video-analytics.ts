import AsyncStorage from "@react-native-async-storage/async-storage";

export type VideoQuality = "auto" | "360p" | "540p" | "720p";
export type VideoAnalyticsEvent = {
  id: string;
  videoUri: string;
  event: "view" | "play" | "pause" | "complete" | "seek" | "quality";
  positionSeconds?: number;
  quality?: VideoQuality;
  createdAt: string;
};

const ANALYTICS_KEY = "fitpath.video.analytics.v1";

export function cloudinaryQualityUrl(videoUrl: string, quality: VideoQuality) {
  if (quality === "auto") return videoUrl;
  const width = quality === "360p" ? 640 : quality === "540p" ? 960 : 1280;
  return videoUrl.replace("/video/upload/", `/video/upload/w_${width},q_auto/`);
}

export async function recordVideoAnalytics(event: Omit<VideoAnalyticsEvent, "id" | "createdAt">) {
  const current = await loadVideoAnalytics();
  const next: VideoAnalyticsEvent = { ...event, id: `video-event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: new Date().toISOString() };
  await AsyncStorage.setItem(ANALYTICS_KEY, JSON.stringify([...current.slice(-499), next]));
}

export async function loadVideoAnalytics(): Promise<VideoAnalyticsEvent[]> {
  const raw = await AsyncStorage.getItem(ANALYTICS_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as VideoAnalyticsEvent[]; } catch { return []; }
}
