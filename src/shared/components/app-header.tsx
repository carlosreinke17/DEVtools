import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/shared/theme/theme-provider";
import { radius, spacing } from "@/shared/theme/tokens";

export function AppHeader() {
  const { colors } = useAppTheme();
  const [pressed, setPressed] = useState(false);
  return (
    <View style={styles.header}>
      <View style={styles.brand}>
        <View style={[styles.mark, { backgroundColor: colors.primarySoft }]}>
          <Text aria-hidden style={[styles.symbol, { color: colors.primary }]}>
            {"</>"}
          </Text>
        </View>
        <Text style={[styles.name, { color: colors.text }]}>DEVtools</Text>
      </View>
      <Link href="/settings" asChild>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel="Abrir configurações de aparência"
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          style={StyleSheet.flatten([
            styles.button,
            {
              backgroundColor: colors.surfaceRaised,
              opacity: pressed ? 0.7 : 1,
            },
          ])}
        >
          <Text style={[styles.label, { color: colors.text }]}>Aparência</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  brand: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  mark: {
    width: 42,
    height: 42,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  symbol: { fontSize: 18, fontWeight: "800" },
  name: { fontSize: 23, fontWeight: "800", letterSpacing: -0.8 },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: radius.sm,
    minHeight: 48,
    justifyContent: "center",
  },
  label: { fontSize: 13, fontWeight: "600" },
});
