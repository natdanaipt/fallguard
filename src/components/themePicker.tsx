import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Theme, useTheme } from "../utils/theme";
import { Section } from "./ui";

export default function ThemePicker() {
  const t = useTheme();
  const styles = useMemo(() => makeStyles(t), [t]);

  return (
    <Section title="Theme" subtitle="Current app colours." icon="color-palette" tone="accent2">
      <View style={styles.row}>
        <View style={styles.item} accessibilityLabel="Deep ocean theme, selected">
          <View style={[styles.ring, { borderColor: t.text }]}>
            <LinearGradient
              colors={[t.bgGradient[0], t.accent, t.accent2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.swatch}
            >
              <Ionicons name="checkmark" size={24} color="#FFFFFF" />
            </LinearGradient>
          </View>
          <Text style={[styles.label, { color: t.text }]}>Deep ocean</Text>
        </View>
      </View>
    </Section>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    row: { flexDirection: "row", justifyContent: "space-between", marginTop: 18 },
    item: { alignItems: "center", gap: 8 },
    ring: {
      alignItems: "center",
      borderColor: "transparent",
      borderRadius: 999,
      borderWidth: 2.5,
      padding: 3,
    },
    swatch: {
      alignItems: "center",
      borderRadius: 999,
      height: 52,
      justifyContent: "center",
      width: 52,
    },
    label: { color: t.muted, fontSize: 13, fontWeight: "600" },
  });
