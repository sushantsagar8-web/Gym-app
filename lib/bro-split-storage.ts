import AsyncStorage from "@react-native-async-storage/async-storage";
import type { BroSplitAudience, BroSplitExperience, BroSplitSchedule } from "@/shared/bro-split";

const KEY = "fitpath.bro-split-schedule.v1";

export async function loadBroSplitSchedule(audience: BroSplitAudience, experience: BroSplitExperience): Promise<BroSplitSchedule | null> {
  const raw = await AsyncStorage.getItem(`${KEY}.${audience}`);
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as BroSplitSchedule;
    return { ...value, audience, experience };
  } catch {
    return null;
  }
}

export async function saveBroSplitSchedule(schedule: BroSplitSchedule): Promise<BroSplitSchedule> {
  await AsyncStorage.setItem(`${KEY}.${schedule.audience}`, JSON.stringify(schedule));
  return schedule;
}
