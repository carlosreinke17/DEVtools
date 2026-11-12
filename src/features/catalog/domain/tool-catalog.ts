export const CATEGORIES = [
  {
    id: "generators",
    label: "Geradores",
    shortLabel: "Geradores",
    symbol: "+",
  },
  {
    id: "validators",
    label: "Validadores",
    shortLabel: "Validadores",
    symbol: "✓",
  },
  {
    id: "converters",
    label: "Formatadores / Conversores",
    shortLabel: "Conversores",
    symbol: "{ }",
  },
  { id: "text", label: "Texto / String", shortLabel: "Texto", symbol: "Aa" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];
export type CategoryFilter = "all" | CategoryId;

type ToolDefinition = {
  id: string;
  title: string;
  description: string;
  category: CategoryId;
  keywords: readonly string[];
  status: "planned" | "available";
};

export const TOOLS = [
  {
    id: "cpf-generator",
    title: "Gerar CPF",
    description: "Documentos fictícios para seus cenários de teste.",
    category: "generators",
    keywords: ["documento", "brasil", "pessoa física"],
    status: "planned",
  },
  {
    id: "cnpj-generator",
    title: "Gerar CNPJ",
    description: "Identificadores de empresas para testes.",
    category: "generators",
    keywords: ["documento", "empresa", "pessoa jurídica"],
    status: "planned",
  },
  {
    id: "credit-card-generator",
    title: "Gerar cartão de crédito",
    description: "Números fictícios para testar formulários.",
    category: "generators",
    keywords: ["luhn", "pagamento", "credit card"],
    status: "planned",
  },
  {
    id: "uuid-generator",
    title: "UUID v4",
    description: "Identificadores únicos para o seu projeto.",
    category: "generators",
    keywords: ["guid", "identificador", "aleatório", "gerar uuid"],
    status: "planned",
  },
  {
    id: "lorem-ipsum",
    title: "Lorem Ipsum",
    description: "Texto de preenchimento na medida certa.",
    category: "generators",
    keywords: ["parágrafos", "placeholder", "gerar texto"],
    status: "planned",
  },
  {
    id: "password-generator",
    title: "Senhas fortes",
    description: "Senhas aleatórias com opções personalizáveis.",
    category: "generators",
    keywords: ["password", "segurança", "gerar senha"],
    status: "planned",
  },
  {
    id: "cpf-validator",
    title: "Validar CPF",
    description: "Confira a estrutura e os dígitos verificadores.",
    category: "validators",
    keywords: ["documento", "brasil", "pessoa física"],
    status: "planned",
  },
  {
    id: "cnpj-validator",
    title: "Validar CNPJ",
    description: "Verifique a estrutura de um CNPJ.",
    category: "validators",
    keywords: ["documento", "empresa", "pessoa jurídica"],
    status: "planned",
  },
  {
    id: "credit-card-validator",
    title: "Validar cartão de crédito",
    description: "Confira números com o algoritmo de Luhn.",
    category: "validators",
    keywords: ["luhn", "pagamento", "credit card"],
    status: "planned",
  },
  {
    id: "email-validator",
    title: "Validar email",
    description: "Confira a sintaxe de um endereço de email.",
    category: "validators",
    keywords: ["e-mail", "correio", "endereço"],
    status: "planned",
  },
  {
    id: "json-validator",
    title: "Validar JSON",
    description: "Verifique se o seu JSON tem uma sintaxe válida.",
    category: "validators",
    keywords: ["objeto", "sintaxe", "javascript"],
    status: "planned",
  },
  {
    id: "json-formatter",
    title: "Formatar JSON",
    description: "Organize dados com indentação e legibilidade.",
    category: "converters",
    keywords: ["formatter", "pretty print", "indentação", "minificar"],
    status: "planned",
  },
  {
    id: "base64",
    title: "Base64",
    description: "Codifique e decodifique conteúdo em Base64.",
    category: "converters",
    keywords: ["encode", "decode", "codificar", "decodificar"],
    status: "planned",
  },
  {
    id: "url",
    title: "URL Encode / Decode",
    description: "Codifique e decodifique componentes de URLs.",
    category: "converters",
    keywords: ["uri", "link", "endereço", "codificar", "decodificar"],
    status: "planned",
  },
  {
    id: "unit-converter",
    title: "Conversor de unidades",
    description: "Converta comprimento, massa e temperatura.",
    category: "converters",
    keywords: ["metro", "quilo", "celsius", "medidas"],
    status: "planned",
  },
  {
    id: "text-counter",
    title: "Contador de texto",
    description: "Conte caracteres e palavras do seu texto.",
    category: "text",
    keywords: ["letras", "tamanho", "contagem", "string"],
    status: "planned",
  },
  {
    id: "case-converter",
    title: "Case Converter",
    description: "Alterne entre MAIÚSCULO, minúsculo e camelCase.",
    category: "text",
    keywords: ["caixa", "uppercase", "lowercase", "camel", "string"],
    status: "planned",
  },
] as const satisfies readonly ToolDefinition[];

export type Tool = (typeof TOOLS)[number];
export type ToolId = Tool["id"];

const toolIds = new Set<string>(TOOLS.map((tool) => tool.id));

export function isToolId(value: unknown): value is ToolId {
  return typeof value === "string" && toolIds.has(value);
}

export function getTool(id: string | undefined) {
  return TOOLS.find((tool) => tool.id === id);
}

export function getCategory(id: CategoryId) {
  return CATEGORIES.find((category) => category.id === id)!;
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

type CatalogFilters = {
  query?: string;
  category?: CategoryFilter;
  onlyFavorites?: boolean;
  favoriteIds?: readonly ToolId[];
};

export function filterTools({
  query = "",
  category = "all",
  onlyFavorites = false,
  favoriteIds = [],
}: CatalogFilters = {}): Tool[] {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  return TOOLS.filter((tool) => {
    if (category !== "all" && tool.category !== category) return false;
    if (onlyFavorites && !favoriteIds.includes(tool.id)) return false;
    const searchable = normalize(
      [
        tool.title,
        tool.description,
        getCategory(tool.category).label,
        ...tool.keywords,
      ].join(" "),
    );
    return terms.every((term) => searchable.includes(term));
  });
}

export function parseFavoriteIds(raw: string | null): ToolId[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? [...new Set(value.filter(isToolId))] : [];
  } catch {
    return [];
  }
}
