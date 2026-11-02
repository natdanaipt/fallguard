import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ALERT_SOUNDS, AlertSoundId } from "../utils/alertSounds";
import { useTheme } from "../utils/theme";

export default function SoundPicker({ value, onChange, disabled }: {
  value: AlertSoundId;
  onChange: (id: AlertSoundId) => void;
  disabled: boolean;
}) {
  const t = useTheme();
  return (
    <View style={styles.list} accessibilityRole="radiogroup" accessibilityLabel="Alert sound">
      <Text style={[styles.heading, { color: t.text }]}>Alert sound</Text>
      {ALERT_SOUNDS.map((sound) => (
        <Pressable key={sound.id} disabled={disabled} onPress={() => onChange(sound.id)}
          accessibilityRole="radio" accessibilityLabel={sound.label}
          accessibilityState={{ checked: value === sound.id, disabled }}
          style={[styles.row, { borderColor: value === sound.id ? t.accent : t.border,
            backgroundColor: value === sound.id ? t.accentSoft : t.surface, opacity: disabled ? 0.5 : 1 }]}>
          <Ionicons name={value === sound.id ? "radio-button-on" : "radio-button-off"} size={22} color={t.accent} />
          <View style={styles.text}>
            <Text style={{ color: t.text, fontWeight: "700" }}>{sound.label}</Text>
            <Text style={{ color: t.muted, fontSize: 12 }}>{sound.description}</Text>
          </View>
        </Pressable>
      ))}
      <Text style={{ color: t.muted, fontSize: 12 }}>Choose a sound, then tap Preview. This sound plays when the countdown ends.</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  list: { gap: 8, marginTop: 16 }, heading: { fontSize: 15, fontWeight: "700", marginBottom: 4 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderRadius: 14, borderWidth: 1, minHeight: 56 },
  text: { flex: 1, gap: 3 },
});
