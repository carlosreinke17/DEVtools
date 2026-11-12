import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import type { PropsWithChildren } from "react";

import { CatalogScreen } from "@/features/catalog/presentation/catalog-screen";
import { FavoritesProvider } from "@/features/catalog/state/favorites-provider";
import { AppThemeProvider } from "@/shared/theme/theme-provider";

// Navigation is exercised in the browser smoke test; here links retain their pressable children.
jest.mock("expo-router", () => ({
  Link: ({ children }: PropsWithChildren) => children,
}));

beforeEach(async () => {
  jest.clearAllMocks();
  await AsyncStorage.clear();
});

async function renderCatalog() {
  await render(
    <AppThemeProvider>
      <FavoritesProvider>
        <CatalogScreen />
      </FavoritesProvider>
    </AppThemeProvider>,
  );
  await waitFor(() => expect(AsyncStorage.getItem).toHaveBeenCalledTimes(2));
}

test("search, category filters and clear actions update the visible cards", async () => {
  await renderCatalog();
  await fireEvent.changeText(
    screen.getByLabelText("Buscar ferramentas"),
    "json",
  );
  expect(screen.getAllByRole("link", { name: /Abrir .*JSON/ })).toHaveLength(2);
  await fireEvent.press(
    screen.getByRole("radio", { name: "Categoria Validadores" }),
  );
  expect(
    screen.getByRole("link", { name: "Abrir Validar JSON" }),
  ).toBeOnTheScreen();
  expect(
    screen.queryByRole("link", { name: "Abrir Formatar JSON" }),
  ).toBeNull();
  await fireEvent.changeText(
    screen.getByLabelText("Buscar ferramentas"),
    "nada-encontrado",
  );
  expect(
    screen.getByRole("header", { name: "Nenhuma ferramenta encontrada" }),
  ).toBeOnTheScreen();
  await fireEvent.press(screen.getByRole("button", { name: "Limpar filtros" }));
  expect(screen.getByRole("radio", { name: "Categoria Todas" })).toBeChecked();
  expect(screen.getByLabelText("Buscar ferramentas")).toHaveDisplayValue("");
  expect(
    screen.getByRole("link", { name: "Abrir Gerar CPF" }),
  ).toBeOnTheScreen();
});

test("favoriting from a card updates the favorites view and empty state", async () => {
  await renderCatalog();
  await fireEvent.press(screen.getByRole("tab", { name: "Favoritos" }));
  expect(
    screen.getByRole("header", { name: "Seus favoritos começam aqui" }),
  ).toBeOnTheScreen();
  await fireEvent.press(
    screen.getByRole("button", { name: "Explorar ferramentas" }),
  );
  await fireEvent.press(
    screen.getByRole("button", { name: "Adicionar Gerar CPF aos favoritos" }),
  );
  await fireEvent.press(screen.getByRole("tab", { name: "Favoritos" }));
  expect(screen.getByRole("tab", { name: "Favoritos" })).toBeSelected();
  expect(
    screen.getByRole("link", { name: "Abrir Gerar CPF" }),
  ).toBeOnTheScreen();
  expect(screen.queryByRole("link", { name: "Abrir Gerar CNPJ" })).toBeNull();
  await fireEvent.press(
    screen.getByRole("button", { name: "Remover Gerar CPF dos favoritos" }),
  );
  expect(
    screen.getByRole("header", { name: "Seus favoritos começam aqui" }),
  ).toBeOnTheScreen();
});
