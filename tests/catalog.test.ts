import {
  filterTools,
  getTool,
  parseFavoriteIds,
  TOOLS,
} from "@/features/catalog/domain/tool-catalog";

test("search ignores accents, case and extra spaces", () => {
  expect(
    filterTools({ query: "  CARTAO   CREDITO " }).map((tool) => tool.id),
  ).toEqual(["credit-card-generator", "credit-card-validator"]);
});

test("search supports aliases and requires every search term", () => {
  expect(filterTools({ query: "GUID" }).map((tool) => tool.id)).toEqual([
    "uuid-generator",
  ]);
  expect(filterTools({ query: "pretty print" }).map((tool) => tool.id)).toEqual(
    ["json-formatter"],
  );
  expect(filterTools({ query: "cpf impossível" })).toEqual([]);
});

test("category, search and favorites filters are combined", () => {
  const favoriteIds = [
    "json-formatter",
    "json-validator",
    "cpf-generator",
  ] as const;
  expect(
    filterTools({
      query: "JSON",
      category: "validators",
      onlyFavorites: true,
      favoriteIds,
    }).map((tool) => tool.id),
  ).toEqual(["json-validator"]);
  expect(
    filterTools({
      query: "CPF",
      category: "validators",
      onlyFavorites: true,
      favoriteIds,
    }),
  ).toEqual([]);
  expect(filterTools({ query: "   " })).toHaveLength(TOOLS.length);
});

test("generation and validation have distinct stable routes", () => {
  expect(new Set(TOOLS.map((tool) => tool.id)).size).toBe(TOOLS.length);
  expect(getTool("cpf-generator")?.category).toBe("generators");
  expect(getTool("cpf-validator")?.category).toBe("validators");
  expect(getTool("not-a-tool")).toBeUndefined();
  expect(getTool(undefined)).toBeUndefined();
});

test("stored favorites discard unknown ids, duplicates and malformed data", () => {
  expect(
    parseFavoriteIds(
      '["cpf-generator","unknown",5,null,"cpf-generator","base64"]',
    ),
  ).toEqual(["cpf-generator", "base64"]);
  for (const value of [null, "", "not-json", "{}", '"cpf-generator"']) {
    expect(parseFavoriteIds(value)).toEqual([]);
  }
});
