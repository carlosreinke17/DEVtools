import type { ComponentProps, ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

import { useAppTheme } from "@/shared/theme/theme-provider";
import { radius, spacing } from "@/shared/theme/tokens";

type EmptyStateProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function EmptyState({ title, description, children }: EmptyStateProps) {
  const { colors } = useAppTheme();
  return (
    <View
      style={[
        styles.box,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Text
        accessibilityRole="header"
        style={[styles.title, { color: colors.text }]}
      >
        {title}
      </Text>
      <Text style={[styles.description, { color: colors.textMuted }]}>
        {description}
      </Text>
      {children}
    </View>
  );
}

export function CatalogLink(props: Omit<ComponentProps<typeof Link>, "href">) {
  const { colors } = useAppTheme();
  return (
    <Link
      {...props}
      href="/"
      style={[styles.link, { color: colors.primary }]}
    />
  );
}

const styles = StyleSheet.create({
  box: {
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.md,
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "700", textAlign: "center" },
  description: { fontSize: 14, lineHeight: 23, textAlign: "center" },
  link: { fontSize: 14, fontWeight: "700", paddingVertical: 16 },
});
