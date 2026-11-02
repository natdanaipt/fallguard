import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from "expo-audio";
import { ALERT_SOUNDS, AlertSoundId, DEFAULT_ALERT_SOUND } from "./alertSounds";

// Bundled sounds work offline. Output volume still follows the phone's media volume.
const players = new Map<AlertSoundId, AudioPlayer>();
let modePromise: Promise<void> | null = null;
let playbackId = 0;
let previewActive = false;
let previewTimer: ReturnType<typeof setTimeout> | null = null;

export async function preloadSiren(id: AlertSoundId = DEFAULT_ALERT_SOUND) {
  if (!modePromise) {
    modePromise = setAudioModeAsync({ playsInSilentMode: true }).catch((error) => {
      modePromise = null;
      throw error;
    });
  }
  await modePromise;
  let player = players.get(id);
  if (!player) {
    const sound = ALERT_SOUNDS.find((item) => item.id === id) ?? ALERT_SOUNDS[0];
    player = createAudioPlayer(sound.source);
    player.loop = true;
    player.volume = 1;
    players.set(id, player);
  }
  return player;
}

export function stopSiren() {
  playbackId++;
  previewActive = false;
  if (previewTimer) clearTimeout(previewTimer);
  previewTimer = null;
  for (const player of players.values()) {
    try { player.pause(); } catch {}
  }
}

export function stopPreview() {
  if (previewActive) stopSiren();
}

async function playSound(id: AlertSoundId, preview: boolean) {
  stopSiren();
  const requestId = playbackId;
  previewActive = preview;
  try {
    const player = await preloadSiren(id);
    if (requestId !== playbackId) return;
    await player.seekTo(0);
    if (requestId !== playbackId) return;
    player.play();
    if (preview) {
      // A stale preview must never stop a newer emergency alarm.
      previewTimer = setTimeout(() => {
        if (requestId === playbackId) stopSiren();
      }, 3000);
    }
  } catch (error) {
    if (requestId === playbackId) stopSiren();
    console.warn("Alert sound failed:", error);
    throw error;
  }
}

export const startSiren = (id: AlertSoundId = DEFAULT_ALERT_SOUND) => playSound(id, false);
export const previewSiren = (id: AlertSoundId) => playSound(id, true);

export function releaseSirens() {
  stopSiren();
  for (const player of players.values()) {
    try { player.remove(); } catch {}
  }
  players.clear();
}
