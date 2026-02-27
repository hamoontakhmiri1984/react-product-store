import { useEffect, useMemo, useState } from "react";

const LIMIT = 16;

export type SortKey =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "rating_desc"
  | "discount_desc";

export type PageState = {
  page: number;

  search: string;
  debouncedSearch: string;

  sort: SortKey;

  categories: string[];
  brands: string[];
  inStockOnly: boolean;

  priceMin?: number;
  priceMax?: number;
};

function parseBool(v: string | null) {
  return v === "1" || v === "true";
}

function parseSort(v: string | null): SortKey {
  if (
    v === "price_asc" ||
    v === "price_desc" ||
    v === "rating_desc" ||
    v === "discount_desc" ||
    v === "newest"
  )
    return v;
  return "newest";
}

function parsePage(v: string | null) {
  const n = Number(v);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

function parseNum(v: string | null): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function parseArray(v: string | null): string[] {
  if (!v) return [];
  return v.split(",").filter(Boolean);
}

function getInitialStateFromUrl(): PageState {
  const sp = new URLSearchParams(window.location.search);

  const page = parsePage(sp.get("page"));
  const q = sp.get("q") ?? "";
  const sort = parseSort(sp.get("sort"));

  const categories = parseArray(sp.get("cat"));
  const brands = parseArray(sp.get("brand"));
  const inStockOnly = parseBool(sp.get("stock"));

  const priceMin = parseNum(sp.get("pmin"));
  const priceMax = parseNum(sp.get("pmax"));

  return {
    page,
    search: q,
    debouncedSearch: q,
    sort,
    categories,
    brands,
    inStockOnly,
    priceMin,
    priceMax,
  };
}

export function useProductsPageState() {
  const [ui, setUi] = useState<PageState>(() => getInitialStateFromUrl());

  const toggleCategory = (category: string) => {
    setUi((prev) => ({
      ...prev,
      page: 1,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const toggleBrand = (brand: string) => {
    setUi((prev) => ({
      ...prev,
      page: 1,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand],
    }));
  };

  const setInStockOnly = (value: boolean) => {
    setUi((prev) => ({
      ...prev,
      page: 1,
      inStockOnly: value,
    }));
  };

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      const nextQ = ui.search.trim();

      setUi((prev) => ({
        ...prev,
        debouncedSearch: nextQ,
        page: 1,
      }));
    }, 500);

    return () => clearTimeout(t);
  }, [ui.search]);

  // URL sync
  useEffect(() => {
    const sp = new URLSearchParams();

    if (ui.page > 1) sp.set("page", String(ui.page));
    if (ui.debouncedSearch) sp.set("q", ui.debouncedSearch);
    if (ui.sort !== "newest") sp.set("sort", ui.sort);

    if (ui.categories.length) sp.set("cat", ui.categories.join(","));
    if (ui.brands.length) sp.set("brand", ui.brands.join(","));
    if (ui.inStockOnly) sp.set("stock", "1");

    if (ui.priceMin !== undefined) sp.set("pmin", String(ui.priceMin));
    if (ui.priceMax !== undefined) sp.set("pmax", String(ui.priceMax));

    const next = sp.toString();
    const nextUrl = next ? `?${next}` : window.location.pathname;

    window.history.replaceState(null, "", nextUrl);
  }, [ui]);

  const skip = useMemo(() => (ui.page - 1) * LIMIT, [ui.page]);

  return {
    ui,
    setUi,
    skip,
    LIMIT,

    toggleCategory,
    toggleBrand,
    setInStockOnly,

    clearAll: () =>
      setUi({
        page: 1,
        search: "",
        debouncedSearch: "",
        sort: "newest",
        categories: [],
        brands: [],
        inStockOnly: false,
        priceMin: undefined,
        priceMax: undefined,
      }),
  };
}
