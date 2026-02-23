import { useEffect, useMemo, useState } from "react";

export type SortKey = "newest" | "price_asc" | "price_desc" | "rating_desc";

export type PageState = {
  page: number;

  search: string;
  debouncedSearch: string;

  sort: SortKey;

  category: string;
  brand: string;
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
  if (v === null || v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function getInitialStateFromUrl(): PageState {
  const sp = new URLSearchParams(window.location.search);

  const page = parsePage(sp.get("page"));
  const q = sp.get("q") ?? "";
  const sort = parseSort(sp.get("sort"));
  const category = sp.get("cat") ?? "all";
  const brand = sp.get("brand") ?? "all";
  const inStockOnly = parseBool(sp.get("stock"));

  const priceMin = parseNum(sp.get("pmin"));
  const priceMax = parseNum(sp.get("pmax"));

  return {
    page,
    search: q,
    debouncedSearch: q,
    sort,
    category,
    brand,
    inStockOnly,
    priceMin,
    priceMax,
  };
}

export function useProductsPageState() {
  const [ui, setUi] = useState<PageState>(() => getInitialStateFromUrl());

  // debounce + reset page + reset some filters on search change
  useEffect(() => {
    const t = setTimeout(() => {
      const nextQ = ui.search.trim();

      setUi((prev) => {
        // اگر تغییری نیست برنگردون رندر اضافه
        if (
          prev.debouncedSearch === nextQ &&
          prev.page === 1 &&
          prev.category === "all" &&
          prev.brand === "all" &&
          prev.priceMin === undefined &&
          prev.priceMax === undefined
        ) {
          return prev;
        }

        return {
          ...prev,
          debouncedSearch: nextQ,
          page: 1,
          category: "all",
          brand: "all",
          priceMin: undefined,
          priceMax: undefined,
        };
      });
    }, 500);

    return () => clearTimeout(t);
  }, [ui.search]);

  // URL sync
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);

    if (ui.page > 1) sp.set("page", String(ui.page));
    else sp.delete("page");

    if (ui.debouncedSearch) sp.set("q", ui.debouncedSearch);
    else sp.delete("q");

    if (ui.sort !== "newest") sp.set("sort", ui.sort);
    else sp.delete("sort");

    if (ui.category !== "all") sp.set("cat", ui.category);
    else sp.delete("cat");

    if (ui.brand !== "all") sp.set("brand", ui.brand);
    else sp.delete("brand");

    if (ui.inStockOnly) sp.set("stock", "1");
    else sp.delete("stock");

    if (ui.priceMin !== undefined) sp.set("pmin", String(ui.priceMin));
    else sp.delete("pmin");

    if (ui.priceMax !== undefined) sp.set("pmax", String(ui.priceMax));
    else sp.delete("pmax");

    const next = sp.toString();
    const nextUrl = next ? `?${next}` : window.location.pathname;

    window.history.replaceState(null, "", nextUrl);
  }, [ui]);

  const skip = useMemo(() => (ui.page - 1) * 12, [ui.page]);

  return {
    ui,
    setUi,

    // helper values
    skip,

    // actions (optional helper)
    clearAll: () =>
      setUi((p) => ({
        ...p,
        page: 1,
        search: "",
        debouncedSearch: "",
        sort: "newest",
        category: "all",
        brand: "all",
        inStockOnly: false,
        priceMin: undefined,
        priceMax: undefined,
      })),
  };
}
