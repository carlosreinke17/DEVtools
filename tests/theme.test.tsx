import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { Text, useColorScheme } from "react-native";

import { AppearanceScreen } from "@/features/settings/presentation/appearance-screen";
import {
  AppThemeProvider,
  THEME_STORAGE_KEY,
  useAppTheme,
} from "@/shared/theme/theme-provider";

jest.mock("react-native/Libraries/Utilities/useColorScheme", () => ({
  __esModule: true,
  default: jest.fn(),
}));
const mockUseColorScheme = jest.mocked(useColorScheme);

function ThemeProbe() {
  const { colorScheme, isLoaded } = useAppTheme();
  return (
    <Text testID="resolved-theme">{isLoaded ? colorScheme : "loading"}</Text>
  );
}
async function renderAppearance() {
  return render(
    <AppThemeProvider>
      <AppearanceScreen />
      <ThemeProbe />
    </AppThemeProvider>,
  );
}
beforeEach(async () => {
  jest.clearAllMocks();
  await AsyncStorage.clear();
  mockUseColorScheme.mockReturnValue("light");
});

test("automatic mode follows system changes without overwriting the preference", async () => {
  const { rerender } = await renderAppearance();
  await waitFor(() =>
    expect(screen.getByTestId("resolved-theme")).toHaveTextContent("light"),
  );
  expect(screen.getByRole("radio", { name: "Automático" })).toBeChecked();
  mockUseColorScheme.mockReturnValue("dark");
  await rerender(
    <AppThemeProvider>
      <AppearanceScreen />
      <ThemeProbe />
    </AppThemeProvider>,
  );
  expect(screen.getByTestId("resolved-theme")).toHaveTextContent("dark");
  expect(screen.getByRole("radio", { name: "Automático" })).toBeChecked();
  expect(AsyncStorage.setItem).not.toHaveBeenCalled();
});

test("manual selection is applied, saved and restored after remounting", async () => {
  const first = await renderAppearance();
  await waitFor(() =>
    expect(screen.getByTestId("resolved-theme")).toHaveTextContent("light"),
  );
  await fireEvent.press(screen.getByRole("radio", { name: "Escuro" }));
  expect(screen.getByTestId("resolved-theme")).toHaveTextContent("dark");
  expect(screen.getByRole("radio", { name: "Escuro" })).toBeChecked();
  await waitFor(() =>
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      THEME_STORAGE_KEY,
      "dark",
    ),
  );
  await first.unmount();
  await renderAppearance();
  await waitFor(() =>
    expect(screen.getByRole("radio", { name: "Escuro" })).toBeChecked(),
  );
  expect(screen.getByTestId("resolved-theme")).toHaveTextContent("dark");
});

test("manual mode overrides the system and can return to automatic", async () => {
  await AsyncStorage.setItem(THEME_STORAGE_KEY, "light");
  mockUseColorScheme.mockReturnValue("dark");
  await renderAppearance();
  await waitFor(() =>
    expect(screen.getByRole("radio", { name: "Claro" })).toBeChecked(),
  );
  expect(screen.getByTestId("resolved-theme")).toHaveTextContent("light");
  await fireEvent.press(screen.getByRole("radio", { name: "Automático" }));
  expect(screen.getByTestId("resolved-theme")).toHaveTextContent("dark");
  await waitFor(() =>
    expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(
      THEME_STORAGE_KEY,
      "system",
    ),
  );
});

test("an invalid stored preference falls back to the system", async () => {
  await AsyncStorage.setItem(THEME_STORAGE_KEY, "invalid-value");
  mockUseColorScheme.mockReturnValue("dark");
  await renderAppearance();
  await waitFor(() =>
    expect(screen.getByTestId("resolved-theme")).toHaveTextContent("dark"),
  );
  expect(screen.getByRole("radio", { name: "Automático" })).toBeChecked();
});

test("unavailable system appearance falls back to light", async () => {
  mockUseColorScheme.mockReturnValue(null);
  await renderAppearance();
  await waitFor(() =>
    expect(screen.getByTestId("resolved-theme")).toHaveTextContent("light"),
  );
});

test("a storage read failure does not prevent startup", async () => {
  jest
    .mocked(AsyncStorage.getItem)
    .mockRejectedValueOnce(new Error("storage unavailable"));
  await renderAppearance();
  await waitFor(() =>
    expect(screen.getByTestId("resolved-theme")).toHaveTextContent("light"),
  );
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Não foi possível ler sua preferência. Usamos o tema do sistema.",
  );
});

test("a failed save keeps the theme usable and allows another attempt", async () => {
  await renderAppearance();
  await waitFor(() =>
    expect(screen.getByTestId("resolved-theme")).toHaveTextContent("light"),
  );
  jest
    .mocked(AsyncStorage.setItem)
    .mockRejectedValueOnce(new Error("storage full"));
  await fireEvent.press(screen.getByRole("radio", { name: "Escuro" }));
  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Não foi possível salvar. O tema foi aplicado apenas nesta sessão.",
    ),
  );
  expect(screen.getByTestId("resolved-theme")).toHaveTextContent("dark");
  await fireEvent.press(screen.getByRole("radio", { name: "Escuro" }));
  await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
  expect(await AsyncStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
});

test("quick selections save the latest preference after pending writes finish", async () => {
  await renderAppearance();
  await waitFor(() =>
    expect(screen.getByTestId("resolved-theme")).toHaveTextContent("light"),
  );
  let finishFirstWrite!: () => void;
  jest.mocked(AsyncStorage.setItem).mockImplementationOnce(
    () =>
      new Promise<void>((resolve) => {
        finishFirstWrite = resolve;
      }),
  );
  await fireEvent.press(screen.getByRole("radio", { name: "Escuro" }));
  await fireEvent.press(screen.getByRole("radio", { name: "Claro" }));
  expect(screen.getByTestId("resolved-theme")).toHaveTextContent("light");
  expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
  await act(async () => finishFirstWrite());
  await waitFor(() =>
    expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(
      THEME_STORAGE_KEY,
      "light",
    ),
  );
  expect(await AsyncStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
});

test("an older failed write does not report an error for a newer saved selection", async () => {
  await renderAppearance();
  await waitFor(() =>
    expect(screen.getByTestId("resolved-theme")).toHaveTextContent("light"),
  );
  let rejectFirstWrite!: (error: Error) => void;
  jest.mocked(AsyncStorage.setItem).mockImplementationOnce(
    () =>
      new Promise<void>((_resolve, reject) => {
        rejectFirstWrite = reject;
      }),
  );
  await fireEvent.press(screen.getByRole("radio", { name: "Escuro" }));
  await fireEvent.press(screen.getByRole("radio", { name: "Claro" }));
  await act(async () => rejectFirstWrite(new Error("older write failed")));
  await waitFor(() =>
    expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(
      THEME_STORAGE_KEY,
      "light",
    ),
  );
  expect(await AsyncStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  expect(screen.queryByRole("alert")).toBeNull();
});
