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

import {
  parseFavoriteIds,
  type ToolId,
} from "@/features/catalog/domain/tool-catalog";

export const FAVORITES_STORAGE_KEY = "@devtools/favorite-tools";

type FavoritesContextValue = {
  favoriteIds: readonly ToolId[];
  isLoaded: boolean;
  storageError: string | null;
  toggleFavorite: (id: ToolId) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: PropsWithChildren) {
  const [favoriteIds, setFavoriteIds] = useState<ToolId[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const currentIds = useRef<ToolId[]>([]);
  const loaded = useRef(false);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const latestSelection = useRef(0);

  useEffect(() => {
    let active = true;
    async function restore() {
      try {
        const ids = parseFavoriteIds(
          await AsyncStorage.getItem(FAVORITES_STORAGE_KEY),
        );
        if (active) {
          currentIds.current = ids;
          setFavoriteIds(ids);
        }
      } catch {
        if (active)
          setStorageError(
            "Não foi possível carregar seus favoritos. Você pode continuar explorando.",
          );
      } finally {
        if (active) {
          loaded.current = true;
          setIsLoaded(true);
        }
      }
    }
    void restore();
    return () => {
      active = false;
      loaded.current = false;
    };
  }, []);

  const toggleFavorite = useCallback((id: ToolId) => {
    if (!loaded.current) return;
    const next = currentIds.current.includes(id)
      ? currentIds.current.filter((saved) => saved !== id)
      : [...currentIds.current, id];
    const selection = ++latestSelection.current;
    currentIds.current = next;
    setFavoriteIds(next);
    setStorageError(null);
    saveQueue.current = saveQueue.current
      .then(() =>
        AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next)),
      )
      .catch(() => {
        if (selection === latestSelection.current) {
          setStorageError(
            "Não foi possível salvar os favoritos. As alterações valem apenas nesta sessão.",
          );
        }
      });
  }, []);

  const value = useMemo(
    () => ({ favoriteIds, isLoaded, storageError, toggleFavorite }),
    [favoriteIds, isLoaded, storageError, toggleFavorite],
  );
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context)
    throw new Error("useFavorites deve ser usado dentro de FavoritesProvider.");
  return context;
}
