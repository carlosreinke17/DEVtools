import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { Pressable, Text } from "react-native";

import {
  FAVORITES_STORAGE_KEY,
  FavoritesProvider,
  useFavorites,
} from "@/features/catalog/state/favorites-provider";

function FavoritesProbe() {
  const { favoriteIds, toggleFavorite, isLoaded, storageError } =
    useFavorites();
  return (
    <>
      <Text testID="favorite-ids">
        {isLoaded ? JSON.stringify(favoriteIds) : "loading"}
      </Text>
      <Text testID="favorite-error">{storageError ?? "none"}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Alternar CPF"
        onPress={() => toggleFavorite("cpf-generator")}
      >
        <Text>CPF</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Alternar JSON"
        onPress={() => toggleFavorite("json-formatter")}
      >
        <Text>JSON</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Alternar CPF duas vezes"
        onPress={() => {
          toggleFavorite("cpf-generator");
          toggleFavorite("cpf-generator");
        }}
      >
        <Text>Duplo</Text>
      </Pressable>
    </>
  );
}
const renderFavorites = () =>
  render(
    <FavoritesProvider>
      <FavoritesProbe />
    </FavoritesProvider>,
  );

beforeEach(async () => {
  jest.clearAllMocks();
  await AsyncStorage.clear();
});

test("favorites are saved and restored after remounting", async () => {
  const first = await renderFavorites();
  await waitFor(() =>
    expect(screen.getByTestId("favorite-ids")).toHaveTextContent("[]"),
  );
  await fireEvent.press(
    screen.getByRole("button", { name: "Alternar CPF" }),
  );
  await waitFor(() =>
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      FAVORITES_STORAGE_KEY,
      '["cpf-generator"]',
    ),
  );
  await first.unmount();
  await renderFavorites();
  await waitFor(() =>
    expect(screen.getByTestId("favorite-ids")).toHaveTextContent(
      '["cpf-generator"]',
    ),
  );
});

test("rapid toggles in the same event use the latest selection", async () => {
  await renderFavorites();
  await waitFor(() =>
    expect(screen.getByTestId("favorite-ids")).toHaveTextContent("[]"),
  );
  await fireEvent.press(
    screen.getByRole("button", { name: "Alternar CPF duas vezes" }),
  );
  expect(screen.getByTestId("favorite-ids")).toHaveTextContent("[]");
  await waitFor(() =>
    expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(
      FAVORITES_STORAGE_KEY,
      "[]",
    ),
  );
});

test("queued writes preserve the latest list", async () => {
  await renderFavorites();
  await waitFor(() =>
    expect(screen.getByTestId("favorite-ids")).toHaveTextContent("[]"),
  );
  let finish!: () => void;
  jest.mocked(AsyncStorage.setItem).mockImplementationOnce(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
  );
  await fireEvent.press(
    screen.getByRole("button", { name: "Alternar CPF" }),
  );
  await fireEvent.press(screen.getByRole("button", { name: "Alternar JSON" }));
  expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
  await act(async () => finish());
  await waitFor(() =>
    expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(
      FAVORITES_STORAGE_KEY,
      '["cpf-generator","json-formatter"]',
    ),
  );
  expect(await AsyncStorage.getItem(FAVORITES_STORAGE_KEY)).toBe(
    '["cpf-generator","json-formatter"]',
  );
});

test("a read failure allows browsing and new favorite selections", async () => {
  jest
    .mocked(AsyncStorage.getItem)
    .mockRejectedValueOnce(new Error("storage unavailable"));
  await renderFavorites();
  await waitFor(() =>
    expect(screen.getByTestId("favorite-ids")).toHaveTextContent("[]"),
  );
  expect(screen.getByTestId("favorite-error")).toHaveTextContent(
    "Não foi possível carregar seus favoritos. Você pode continuar explorando.",
  );
  await fireEvent.press(
    screen.getByRole("button", { name: "Alternar CPF" }),
  );
  await waitFor(() =>
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      FAVORITES_STORAGE_KEY,
      '["cpf-generator"]',
    ),
  );
  expect(screen.getByTestId("favorite-error")).toHaveTextContent("none");
});

test("a write failure keeps favorites available for the current session", async () => {
  await renderFavorites();
  await waitFor(() =>
    expect(screen.getByTestId("favorite-ids")).toHaveTextContent("[]"),
  );
  jest
    .mocked(AsyncStorage.setItem)
    .mockRejectedValueOnce(new Error("storage full"));
  await fireEvent.press(
    screen.getByRole("button", { name: "Alternar CPF" }),
  );
  expect(screen.getByTestId("favorite-ids")).toHaveTextContent(
    '["cpf-generator"]',
  );
  await waitFor(() =>
    expect(screen.getByTestId("favorite-error")).toHaveTextContent(
      "Não foi possível salvar os favoritos. As alterações valem apenas nesta sessão.",
    ),
  );
  await fireEvent.press(screen.getByRole("button", { name: "Alternar JSON" }));
  await waitFor(() =>
    expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(
      FAVORITES_STORAGE_KEY,
      '["cpf-generator","json-formatter"]',
    ),
  );
  expect(screen.getByTestId("favorite-error")).toHaveTextContent("none");
});
