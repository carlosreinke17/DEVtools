import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { getCategory, getTool } from "@/features/catalog/domain/tool-catalog";
import { FavoriteButton } from "@/features/catalog/presentation/components/favorite-button";
import { useFavorites } from "@/features/catalog/state/favorites-provider";
import { CatalogLink, EmptyState } from "@/shared/components/empty-state";
import { Screen } from "@/shared/components/screen";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { radius, spacing } from "@/shared/theme/tokens";

export function ToolOverviewScreen({ toolId }: { toolId: string | undefined }) {
  const { colors } = useAppTheme();
  const { storageError } = useFavorites();
  const tool = getTool(toolId);

  if (!tool)
    return (
      <Screen>
        <Stack.Screen options={{ title: "Ferramenta não encontrada" }} />
        <EmptyState
          title="Esta ferramenta não foi encontrada"
          description="Explore o catálogo para encontrar as ferramentas disponíveis."
        >
          <CatalogLink dismissTo>Voltar ao catálogo</CatalogLink>
        </EmptyState>
      </Screen>
    );

  const category = getCategory(tool.category);
  return (
    <Screen>
      <Stack.Screen options={{ title: tool.title }} />
      <View style={styles.top}>
        <View
          style={[styles.symbolBox, { backgroundColor: colors.primarySoft }]}
        >
          <Text aria-hidden style={[styles.symbol, { color: colors.primary }]}>
            {category.symbol}
          </Text>
        </View>
        <FavoriteButton tool={tool} />
      </View>
      <View style={styles.heading}>
        <Text style={[styles.category, { color: colors.primary }]}>
          {category.label}
        </Text>
        <Text
          accessibilityRole="header"
          style={[styles.title, { color: colors.text }]}
        >
          {tool.title}
        </Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>
          {tool.description}
        </Text>
      </View>
      <View
        style={[
          styles.comingSoon,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={[styles.badge, { backgroundColor: colors.accentSoft }]}>
          <Text style={[styles.badgeText, { color: colors.accent }]}>
            EM BREVE
          </Text>
        </View>
        <Text
          accessibilityRole="header"
          style={[styles.subtitle, { color: colors.text }]}
        >
          Estamos preparando esta ferramenta
        </Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>
          Enquanto isso, adicione aos favoritos para encontrá-la rapidamente
          quando estiver disponível.
        </Text>
      </View>
      {storageError && (
        <Text
          accessibilityRole="alert"
          style={[
            styles.notice,
            { color: colors.warning, backgroundColor: colors.warningSoft },
          ]}
        >
          {storageError}
        </Text>
      )}
      <CatalogLink dismissTo>Explorar outras ferramentas →</CatalogLink>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing.md,
  },
  symbolBox: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
  },
  symbol: { fontSize: 28, fontWeight: "700" },
  heading: { gap: 12 },
  category: { fontSize: 11, fontWeight: "700", letterSpacing: 0.7 },
  title: { fontSize: 30, lineHeight: 38, fontWeight: "800", letterSpacing: -1 },
  description: { fontSize: 15, lineHeight: 25 },
  comingSoon: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  badgeText: { fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  subtitle: { fontSize: 18, fontWeight: "700", lineHeight: 27 },
  notice: {
    borderRadius: radius.sm,
    padding: spacing.md,
    fontSize: 13,
    lineHeight: 20,
  },
});
