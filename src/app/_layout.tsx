import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";

import {
  FavoritesProvider,
  useFavorites,
} from "@/features/catalog/state/favorites-provider";
import { AppThemeProvider, useAppTheme } from "@/shared/theme/theme-provider";

void SplashScreen.preventAutoHideAsync().catch(() => undefined);

function AppNavigation() {
  const { colors, colorScheme, isLoaded } = useAppTheme();
  const { isLoaded: favoritesLoaded } = useFavorites();
  const ready = isLoaded && favoritesLoaded;
  const baseTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      border: colors.border,
      notification: colors.accent,
    },
  };

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync().catch(() => undefined);
  }, [ready]);
  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.background).catch(
      () => undefined,
    );
  }, [colors.background]);
  if (!ready) return null;

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerTintColor: colors.text,
          headerStyle: { backgroundColor: colors.background },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: "DEVtools", headerShown: false }}
        />
        <Stack.Screen
          name="settings"
          options={{ title: "Aparência", headerBackTitle: "Início" }}
        />
        <Stack.Screen
          name="tools/[toolId]"
          options={{ title: "Ferramenta", headerBackTitle: "Catálogo" }}
        />
        <Stack.Screen
          name="+not-found"
          options={{ title: "Página não encontrada" }}
        />
      </Stack>
    </ThemeProvider>
  );
}

export const unstable_settings = { anchor: "index" };

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <FavoritesProvider>
        <AppNavigation />
      </FavoritesProvider>
    </AppThemeProvider>
  );
}
