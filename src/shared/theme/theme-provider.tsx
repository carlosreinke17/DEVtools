import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useColorScheme } from "react-native";

import {
  colors,
  type ColorScheme,
  isThemePreference,
  resolveColorScheme,
  type ThemeColors,
  type ThemePreference,
} from "./tokens";

export const THEME_STORAGE_KEY = "@devtools/theme-preference";

type AppThemeContextValue = {
  colors: ThemeColors;
  colorScheme: ColorScheme;
  preference: ThemePreference;
  isLoaded: boolean;
  storageError: string | null;
  setPreference: (preference: ThemePreference) => void;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [isLoaded, setIsLoaded] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const latestSelection = useRef(0);

  useEffect(() => {
    let active = true;
    async function restorePreference() {
      try {
        const savedPreference = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (active && isThemePreference(savedPreference))
          setPreferenceState(savedPreference);
      } catch {
        if (active)
          setStorageError(
            "Não foi possível ler sua preferência. Usamos o tema do sistema.",
          );
      } finally {
        if (active) setIsLoaded(true);
      }
    }
    void restorePreference();
    return () => {
      active = false;
    };
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    const selection = ++latestSelection.current;
    setPreferenceState(next);
    setStorageError(null);
    // Serialize writes so quick selections cannot persist an older preference last.
    saveQueue.current = saveQueue.current
      .then(() => AsyncStorage.setItem(THEME_STORAGE_KEY, next))
      .catch(() => {
        if (selection === latestSelection.current) {
          setStorageError(
            "Não foi possível salvar. O tema foi aplicado apenas nesta sessão.",
          );
        }
      });
  }, []);

  const colorScheme = resolveColorScheme(preference, systemScheme);
  const value = useMemo(
    () => ({
      colors: colors[colorScheme],
      colorScheme,
      preference,
      isLoaded,
      storageError,
      setPreference,
    }),
    [colorScheme, preference, isLoaded, storageError, setPreference],
  );

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);
  if (!context)
    throw new Error("useAppTheme deve ser usado dentro de AppThemeProvider.");
  return context;
}
