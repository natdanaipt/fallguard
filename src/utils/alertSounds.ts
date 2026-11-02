export const ALERT_SOUNDS = [
  { id: "siren", label: "Classic siren", description: "Classic siren", source: require("../../assets/siren.wav") },
  { id: "two-tone", label: "Two-tone alarm", description: "Alternating high and low tones", source: require("../../assets/sounds/two-tone.wav") },
  { id: "beeps", label: "Rhythmic beeps", description: "Repeating short beeps", source: require("../../assets/sounds/beeps.wav") },
  { id: "chime", label: "Bell chime", description: "Repeating bell chime", source: require("../../assets/sounds/chime.wav") },
] as const;

export type AlertSoundId = (typeof ALERT_SOUNDS)[number]["id"];
export const DEFAULT_ALERT_SOUND: AlertSoundId = "siren";
export function isAlertSoundId(value: unknown): value is AlertSoundId {
  return ALERT_SOUNDS.some((sound) => sound.id === value);
}
