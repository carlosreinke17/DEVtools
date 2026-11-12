import { Link } from "expo-router";
import { StyleSheet, Text } from "react-native";

import { Screen } from "@/shared/components/screen";
import { useAppTheme } from "@/shared/theme/theme-provider";

export default function NotFoundScreen() {
  const { colors } = useAppTheme();
  return (
    <Screen>
      <Text
        accessibilityRole="header"
        style={[styles.title, { color: colors.text }]}
      >
        Este caminho não existe.
      </Text>
      <Link href="/" replace style={[styles.link, { color: colors.primary }]}>
        Voltar para o início
      </Link>
    </Screen>
  );
}
const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "700" },
  link: { fontSize: 16, paddingVertical: 16 },
});
