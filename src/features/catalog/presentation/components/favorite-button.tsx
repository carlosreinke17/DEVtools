import { Pressable, StyleSheet, Text } from "react-native";

import type { Tool } from "@/features/catalog/domain/tool-catalog";
import { useFavorites } from "@/features/catalog/state/favorites-provider";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { radius } from "@/shared/theme/tokens";

export function FavoriteButton({ tool }: { tool: Tool }) {
  const { colors } = useAppTheme();
  const { favoriteIds, toggleFavorite, isLoaded } = useFavorites();
  const selected = favoriteIds.includes(tool.id);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${selected ? "Remover" : "Adicionar"} ${tool.title} ${selected ? "dos" : "aos"} favoritos`}
      aria-pressed={selected}
      disabled={!isLoaded}
      onPress={() => toggleFavorite(tool.id)}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: selected ? colors.primarySoft : colors.surfaceRaised,
          opacity: pressed ? 0.65 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.star,
          { color: selected ? colors.primary : colors.textMuted },
        ]}
      >
        {selected ? "★" : "☆"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    minHeight: 48,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  star: { fontSize: 25 },
});
