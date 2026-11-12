import { Link } from "expo-router";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/shared/components/screen";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { radius, spacing } from "@/shared/theme/tokens";

const categories = [
  { symbol: "+", title: "Geradores", description: "Dados para seus testes." },
  {
    symbol: "✓",
    title: "Validadores",
    description: "Mais confiança em cada entrada.",
  },
  {
    symbol: "{ }",
    title: "Conversores",
    description: "Do formato ao resultado.",
  },
  {
    symbol: "Aa",
    title: "Texto",
    description: "Pequenos ajustes, menos trabalho.",
  },
] as const;

export function HomeScreen() {
  const { colors } = useAppTheme();
  return (
    <Screen withTopInset>
      <View style={styles.header}>
        <View style={styles.brand}>
          <View
            style={[styles.brandMark, { backgroundColor: colors.primarySoft }]}
          >
            <Text
              accessibilityElementsHidden
              style={[styles.brandSymbol, { color: colors.primary }]}
            >
              {"</>"}
            </Text>
          </View>
          <Text style={[styles.brandName, { color: colors.text }]}>
            DEVtools
          </Text>
        </View>
        <Link href="/settings" asChild>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Abrir configurações de aparência"
            style={({ pressed }) => [
              styles.appearanceButton,
              {
                backgroundColor: colors.surfaceRaised,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text style={[styles.appearanceLabel, { color: colors.text }]}>
              Aparência
            </Text>
          </Pressable>
        </Link>
      </View>

      <View style={styles.hero}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>
          SEU KIT DE DESENVOLVIMENTO
        </Text>
        <Text
          accessibilityRole="header"
          style={[styles.title, { color: colors.text }]}
        >
          Menos tarefas.{"\n"}Mais soluções.
        </Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>
          Utilitários para simplificar o seu dia. No seu dispositivo, no seu
          ritmo.
        </Text>
      </View>

      <View
        style={[styles.offlineCard, { backgroundColor: colors.primarySoft }]}
      >
        <View style={[styles.dot, { backgroundColor: colors.primary }]} />
        <View style={styles.flex}>
          <Text style={[styles.cardTitle, { color: colors.primary }]}>
            Pensado para funcionar offline
          </Text>
          <Text style={[styles.cardDescription, { color: colors.textMuted }]}>
            Suas próximas ferramentas vão processar os dados aqui mesmo.
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text
          accessibilityRole="header"
          style={[styles.sectionTitle, { color: colors.text }]}
        >
          O que vem por aí
        </Text>
        <View style={[styles.badge, { backgroundColor: colors.surfaceRaised }]}>
          <Text style={[styles.badgeText, { color: colors.textMuted }]}>
            EM BREVE
          </Text>
        </View>
      </View>
      <View style={styles.categories}>
        {categories.map((category) => (
          <View
            key={category.title}
            style={[
              styles.category,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.categorySymbol, { color: colors.accent }]}>
              {category.symbol}
            </Text>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {category.title}
            </Text>
            <Text style={[styles.cardDescription, { color: colors.textMuted }]}>
              {category.description}
            </Text>
          </View>
        ))}
      </View>
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          Um espaço feito para o seu fluxo.
        </Text>
        <Link href="/settings" asChild>
          <Pressable accessibilityRole="link" style={styles.footerLink}>
            <Text style={[styles.linkText, { color: colors.primary }]}>
              Personalizar aparência →
            </Text>
          </Pressable>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  brand: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  brandMark: {
    width: 42,
    height: 42,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  brandSymbol: { fontSize: 18, fontWeight: "800" },
  brandName: { fontSize: 23, fontWeight: "800", letterSpacing: -0.8 },
  appearanceButton: {
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: radius.sm,
    minHeight: 48,
    justifyContent: "center",
  },
  appearanceLabel: { fontSize: 13, fontWeight: "600" },
  hero: { gap: spacing.md, paddingTop: spacing.lg, paddingBottom: spacing.sm },
  eyebrow: { fontSize: 11, fontWeight: "700", letterSpacing: 1.8 },
  title: {
    fontSize: 40,
    lineHeight: 46,
    fontWeight: "800",
    letterSpacing: -1.8,
  },
  description: { fontSize: 16, lineHeight: 25, maxWidth: 440 },
  offlineCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  dot: { width: 8, height: 8, borderRadius: radius.pill, marginTop: 6 },
  cardTitle: { fontSize: 14, lineHeight: 20, fontWeight: "700" },
  cardDescription: { fontSize: 13, lineHeight: 20, marginTop: spacing.xs },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    flexWrap: "wrap",
    paddingTop: spacing.sm,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", letterSpacing: -0.4 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  badgeText: { fontSize: 9, fontWeight: "700", letterSpacing: 1 },
  categories: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  category: {
    flexBasis: "44%",
    flexGrow: 1,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    minHeight: 145,
  },
  categorySymbol: {
    fontFamily: Platform.select({ ios: "Menlo", default: "monospace" }),
    fontSize: 23,
    fontWeight: "700",
    marginBottom: spacing.md,
  },
  footer: {
    borderTopWidth: 1,
    paddingTop: spacing.lg,
    gap: spacing.xs,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  footerText: { fontSize: 12, lineHeight: 20, textAlign: "center" },
  footerLink: { minHeight: 48, justifyContent: "center" },
  linkText: { fontSize: 13, fontWeight: "600" },
});
