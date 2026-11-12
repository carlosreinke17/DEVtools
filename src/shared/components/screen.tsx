import type { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "@/shared/theme/theme-provider";
import { spacing } from "@/shared/theme/tokens";

type ScreenProps = PropsWithChildren<{ withTopInset?: boolean }>;

export function Screen({ children, withTopInset = false }: ScreenProps) {
  const { colors } = useAppTheme();
  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={
        withTopInset
          ? ["top", "bottom", "left", "right"]
          : ["bottom", "left", "right"]
      }
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.content}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    padding: spacing.lg,
    gap: spacing.lg,
  },
});
