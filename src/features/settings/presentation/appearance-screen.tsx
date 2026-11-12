import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/shared/components/screen";
import { useAppTheme } from "@/shared/theme/theme-provider";
import {
  colors as palettes,
  radius,
  spacing,
  type ThemePreference,
} from "@/shared/theme/tokens";

const options: {
  value: ThemePreference;
  label: string;
  description: string;
  symbol: string;
}[] = [
  {
    value: "system",
    label: "Automático",
    description: "Acompanha a aparência do dispositivo.",
    symbol: "◐",
  },
  {
    value: "light",
    label: "Claro",
    description: "Leve e nítido para o dia a dia.",
    symbol: "☼",
  },
  {
    value: "dark",
    label: "Escuro",
    description: "Menos brilho para manter o foco.",
    symbol: "☾",
  },
];

export function AppearanceScreen() {
  const { colors, colorScheme, preference, setPreference, storageError } =
    useAppTheme();
  return (
    <Screen>
      <View style={styles.intro}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>
          DO SEU JEITO
        </Text>
        <Text
          accessibilityRole="header"
          style={[styles.title, { color: colors.text }]}
        >
          Seu espaço.{"\n"}Seu tema.
        </Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>
          Escolha o visual mais confortável para você. A mudança acontece na
          hora.
        </Text>
      </View>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel="Tema do aplicativo"
        style={styles.options}
      >
        {options.map((option) => {
          const selected = preference === option.value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityLabel={option.label}
              accessibilityHint={option.description}
              aria-checked={selected}
              onPress={() => setPreference(option.value)}
              style={({ pressed }) => [
                styles.option,
                {
                  backgroundColor: selected
                    ? colors.primarySoft
                    : colors.surface,
                  borderColor: selected ? colors.primary : colors.border,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.optionSymbolBox,
                  { backgroundColor: colors.surfaceRaised },
                ]}
              >
                <Text style={[styles.optionSymbol, { color: colors.text }]}>
                  {option.symbol}
                </Text>
              </View>
              <View style={styles.flex}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>
                  {option.label}
                </Text>
                <Text
                  style={[
                    styles.optionDescription,
                    { color: colors.textMuted },
                  ]}
                >
                  {option.description}
                </Text>
              </View>
              <View
                style={[
                  styles.radio,
                  { borderColor: selected ? colors.primary : colors.textMuted },
                ]}
              >
                {selected && (
                  <View
                    style={[
                      styles.radioDot,
                      { backgroundColor: colors.primary },
                    ]}
                  />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
      {storageError && (
        <View
          accessible
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          style={[styles.notice, { backgroundColor: colors.warningSoft }]}
        >
          <Text style={[styles.noticeText, { color: colors.warning }]}>
            {storageError}
          </Text>
        </View>
      )}
      <View
        style={[
          styles.preview,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.previewHeader}>
          <Text style={[styles.previewTitle, { color: colors.text }]}>
            Uma prévia do seu espaço
          </Text>
          <View style={styles.swatches}>
            {[palettes[colorScheme].primary, palettes[colorScheme].accent].map(
              (color) => (
                <View
                  key={color}
                  style={[styles.swatch, { backgroundColor: color }]}
                />
              ),
            )}
          </View>
        </View>
        <View
          style={[styles.previewCode, { backgroundColor: colors.background }]}
        >
          <Text style={[styles.codeText, { color: colors.primary }]}>
            {'{ "pronto": true }'}
          </Text>
        </View>
        <Text style={[styles.previewCaption, { color: colors.textMuted }]}>
          Tema {colorScheme === "dark" ? "escuro" : "claro"} ativo
        </Text>
      </View>
      <Text style={[styles.footnote, { color: colors.textMuted }]}>
        Sua preferência fica salva neste dispositivo. Nenhuma conta necessária.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  intro: { paddingTop: spacing.md, gap: spacing.md },
  eyebrow: { fontSize: 11, fontWeight: "700", letterSpacing: 1.8 },
  title: {
    fontSize: 36,
    lineHeight: 43,
    fontWeight: "800",
    letterSpacing: -1.4,
  },
  description: { fontSize: 16, lineHeight: 25, maxWidth: 440 },
  options: { gap: 12 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1.5,
    borderRadius: radius.md,
    padding: spacing.md,
    minHeight: 94,
  },
  optionSymbolBox: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  optionSymbol: { fontSize: 25 },
  optionLabel: { fontSize: 15, lineHeight: 22, fontWeight: "700" },
  optionDescription: { fontSize: 12, lineHeight: 18, marginTop: 3 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: { width: 10, height: 10, borderRadius: radius.pill },
  notice: { padding: spacing.md, borderRadius: radius.sm },
  noticeText: { fontSize: 13, lineHeight: 20 },
  preview: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.md,
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  previewTitle: { fontSize: 13, fontWeight: "600" },
  swatches: { flexDirection: "row", gap: 5 },
  swatch: { width: 12, height: 12, borderRadius: radius.pill },
  previewCode: { padding: spacing.lg, borderRadius: radius.sm },
  codeText: { fontSize: 16, fontWeight: "600" },
  previewCaption: { fontSize: 12 },
  footnote: {
    fontSize: 12,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: spacing.md,
  },
});
