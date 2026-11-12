import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { getCategory, type Tool } from "@/features/catalog/domain/tool-catalog";
import { FavoriteButton } from "@/features/catalog/presentation/components/favorite-button";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { radius, spacing } from "@/shared/theme/tokens";

export function ToolCard({ tool }: { tool: Tool }) {
  const { colors } = useAppTheme();
  const [pressed, setPressed] = useState(false);
  const category = getCategory(tool.category);
  return (
    <View
      style={[
        styles.card,
        { borderColor: colors.border, backgroundColor: colors.surface },
      ]}
    >
      <Link
        href={{ pathname: "/tools/[toolId]", params: { toolId: tool.id } }}
        asChild
      >
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`Abrir ${tool.title}`}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          style={StyleSheet.flatten([
            styles.content,
            { opacity: pressed ? 0.65 : 1 },
          ])}
        >
          <Text style={[styles.category, { color: colors.primary }]}>
            {category.label}
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>
            {tool.title}
          </Text>
          <Text style={[styles.description, { color: colors.textMuted }]}>
            {tool.description}
          </Text>
          <Text style={[styles.status, { color: colors.textMuted }]}>
            {tool.status === "planned" ? "Em breve" : "Disponível offline"}{" "}
            <Text style={{ color: colors.primary }}>→</Text>
          </Text>
        </Pressable>
      </Link>
      <View style={styles.favorite}>
        <FavoriteButton tool={tool} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", borderWidth: 1, borderRadius: radius.md },
  content: { flex: 1, gap: 6, padding: spacing.md },
  category: { fontSize: 10, fontWeight: "700", letterSpacing: 0.6 },
  title: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  description: { fontSize: 13, lineHeight: 21 },
  status: { fontSize: 11, marginTop: 5 },
  favorite: { paddingRight: 12, paddingTop: 12 },
});
