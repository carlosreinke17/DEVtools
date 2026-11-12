import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import {
  CATEGORIES,
  filterTools,
  getCategory,
  TOOLS,
  type CategoryFilter,
} from "@/features/catalog/domain/tool-catalog";
import { ToolCard } from "@/features/catalog/presentation/components/tool-card";
import { useFavorites } from "@/features/catalog/state/favorites-provider";
import { AppHeader } from "@/shared/components/app-header";
import { EmptyState } from "@/shared/components/empty-state";
import { Screen } from "@/shared/components/screen";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { radius, spacing } from "@/shared/theme/tokens";

export function CatalogScreen() {
  const { colors } = useAppTheme();
  const { favoriteIds, storageError } = useFavorites();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [view, setView] = useState<"all" | "favorites">("all");
  const [focused, setFocused] = useState(false);
  const onlyFavorites = view === "favorites";
  const tools = filterTools({ query, category, onlyFavorites, favoriteIds });
  const scopedTools = filterTools({ query, onlyFavorites, favoriteIds });
  const emptyFavorites = onlyFavorites && favoriteIds.length === 0;
  const filters = [
    { id: "all" as const, label: "Todas", count: scopedTools.length },
    ...CATEGORIES.map((item) => ({
      id: item.id,
      label: item.shortLabel,
      count: scopedTools.filter((tool) => tool.category === item.id).length,
    })),
  ];

  function clearFilters() {
    setQuery("");
    setCategory("all");
  }

  return (
    <Screen withTopInset>
      <AppHeader />
      <View style={styles.intro}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>
          MENOS TAREFAS. MAIS SOLUÇÕES.
        </Text>
        <Text
          accessibilityRole="header"
          style={[styles.title, { color: colors.text }]}
        >
          Encontre seu{"\n"}próximo atalho.
        </Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>
          {TOOLS.length} ferramentas no catálogo. Explore as opções e salve suas
          preferidas.
        </Text>
      </View>

      <View
        style={[
          styles.search,
          {
            backgroundColor: colors.surface,
            borderColor: focused ? colors.primary : colors.border,
          },
        ]}
      >
        <Text
          aria-hidden
          style={[styles.searchSymbol, { color: colors.textMuted }]}
        >
          ⌕
        </Text>
        <TextInput
          accessibilityLabel="Buscar ferramentas"
          placeholder="CPF, JSON, Base64…"
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          style={[styles.input, { color: colors.text }]}
        />
        {query.length > 0 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Limpar busca"
            onPress={() => setQuery("")}
            style={styles.clearButton}
          >
            <Text style={[styles.clearSymbol, { color: colors.textMuted }]}>
              ×
            </Text>
          </Pressable>
        )}
      </View>

      <View
        accessibilityRole="tablist"
        accessibilityLabel="Visualização do catálogo"
        style={[styles.tabs, { backgroundColor: colors.surfaceRaised }]}
      >
        {(["all", "favorites"] as const).map((tab) => (
          <Pressable
            key={tab}
            accessibilityRole="tab"
            accessibilityLabel={
              tab === "all" ? "Todas as ferramentas" : "Favoritos"
            }
            aria-selected={view === tab}
            onPress={() => setView(tab)}
            style={({ pressed }) => [
              styles.tab,
              {
                backgroundColor: view === tab ? colors.surface : "transparent",
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: view === tab ? colors.primary : colors.textMuted },
              ]}
            >
              {tab === "all"
                ? "Explorar"
                : `★ Favoritos · ${favoriteIds.length}`}
            </Text>
          </Pressable>
        ))}
      </View>

      <View
        accessibilityRole="radiogroup"
        accessibilityLabel="Categorias de ferramentas"
        style={styles.filters}
      >
        {filters.map((item) => {
          const selected = category === item.id;
          return (
            <Pressable
              key={item.id}
              accessibilityRole="radio"
              accessibilityLabel={`Categoria ${item.label}`}
              aria-checked={selected}
              onPress={() => setCategory(item.id)}
              style={({ pressed }) => [
                styles.filter,
                {
                  borderColor: selected ? colors.primary : colors.border,
                  backgroundColor: selected
                    ? colors.primarySoft
                    : colors.surface,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: selected ? colors.primary : colors.textMuted },
                ]}
              >
                {item.label}{" "}
                <Text style={styles.filterCount}>· {item.count}</Text>
              </Text>
            </Pressable>
          );
        })}
      </View>

      {storageError && (
        <Text
          accessibilityRole="alert"
          aria-live="polite"
          style={[
            styles.notice,
            { backgroundColor: colors.warningSoft, color: colors.warning },
          ]}
        >
          {storageError}
        </Text>
      )}

      <View style={styles.resultsHeader}>
        <Text
          accessibilityRole="header"
          style={[styles.sectionTitle, { color: colors.text }]}
        >
          {category !== "all"
            ? getCategory(category).label
            : onlyFavorites
              ? "Seus favoritos"
              : "Todas as ferramentas"}
        </Text>
        <Text
          aria-live="polite"
          style={[styles.resultCount, { color: colors.textMuted }]}
        >
          {tools.length} {tools.length === 1 ? "encontrada" : "encontradas"}
        </Text>
      </View>

      {tools.length > 0 ? (
        <View style={styles.list}>
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </View>
      ) : (
        <EmptyState
          title={
            emptyFavorites
              ? "Seus favoritos começam aqui"
              : "Nenhuma ferramenta encontrada"
          }
          description={
            emptyFavorites
              ? "Toque na estrela de uma ferramenta para criar seus atalhos. Seus favoritos ficam salvos neste dispositivo."
              : "Experimente outro termo ou limpe os filtros para continuar explorando."
          }
        >
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              clearFilters();
              if (emptyFavorites) setView("all");
            }}
            style={({ pressed }) => [
              styles.emptyAction,
              {
                backgroundColor: colors.primarySoft,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text style={[styles.actionText, { color: colors.primary }]}>
              {emptyFavorites ? "Explorar ferramentas" : "Limpar filtros"}
            </Text>
          </Pressable>
        </EmptyState>
      )}

      <Text style={[styles.footnote, { color: colors.textMuted }]}>
        As ferramentas estão chegando. Salve suas preferidas e prepare seu
        espaço.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: 10, paddingTop: spacing.sm },
  eyebrow: { fontSize: 10, fontWeight: "700", letterSpacing: 1.4 },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    letterSpacing: -1.3,
  },
  description: { fontSize: 14, lineHeight: 22, maxWidth: 460 },
  search: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: radius.sm,
    paddingLeft: 14,
    minHeight: 56,
  },
  searchSymbol: { fontSize: 28, marginRight: 10 },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 16,
    paddingRight: 8,
    fontSize: 15,
  },
  clearButton: {
    width: 48,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  clearSymbol: { fontSize: 26 },
  tabs: { flexDirection: "row", padding: 4, gap: 4, borderRadius: radius.sm },
  tab: {
    flex: 1,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9,
    padding: 8,
  },
  tabText: { fontSize: 13, fontWeight: "700" },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  filter: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: "center",
  },
  filterText: { fontSize: 12, fontWeight: "600" },
  filterCount: { fontWeight: "400" },
  notice: {
    padding: spacing.md,
    borderRadius: radius.sm,
    fontSize: 13,
    lineHeight: 20,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  sectionTitle: { fontSize: 17, fontWeight: "700", flexShrink: 1 },
  resultCount: { fontSize: 11 },
  list: { gap: 12 },
  emptyAction: {
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
  },
  actionText: { fontSize: 13, fontWeight: "700" },
  footnote: {
    fontSize: 12,
    lineHeight: 20,
    textAlign: "center",
    paddingVertical: spacing.md,
  },
});
