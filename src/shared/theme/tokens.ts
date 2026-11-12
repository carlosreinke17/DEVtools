export const colors = {
  light: {
    background: "#F6F8FC",
    surface: "#FFFFFF",
    surfaceRaised: "#EDF1F7",
    text: "#17243B",
    textMuted: "#52627A",
    border: "#DCE3ED",
    primary: "#006B60",
    onPrimary: "#FFFFFF",
    primarySoft: "#DDF5EF",
    accent: "#5542A6",
    accentSoft: "#EDE9FC",
    warning: "#8B4300",
    warningSoft: "#FFF1DE",
  },
  dark: {
    background: "#0C1424",
    surface: "#131F33",
    surfaceRaised: "#1B2B43",
    text: "#F0F4FC",
    textMuted: "#A8B8D0",
    border: "#2B3C55",
    primary: "#68E0C8",
    onPrimary: "#0C2824",
    primarySoft: "#173B38",
    accent: "#C3B4FF",
    accentSoft: "#30294D",
    warning: "#FFD49E",
    warningSoft: "#422D18",
  },
} as const;

export type ColorScheme = keyof typeof colors;
export type ThemeColors = { [K in keyof typeof colors.light]: string };
export type ThemePreference = "system" | ColorScheme;
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;
export const radius = { sm: 12, md: 20, lg: 28, pill: 999 } as const;

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "system" || value === "light" || value === "dark";
}

export function resolveColorScheme(
  preference: ThemePreference,
  systemScheme: string | null | undefined,
): ColorScheme {
  return preference === "system"
    ? systemScheme === "dark"
      ? "dark"
      : "light"
    : preference;
}
