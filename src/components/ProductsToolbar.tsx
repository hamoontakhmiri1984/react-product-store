import type { SortKey } from "../features/products/useProductsPageState";

type ProductsToolbarProps = {
  search: string;
  onSearchChange: (v: string) => void;

  sort: SortKey;
  onSortChange: (v: SortKey) => void;

  category: string;
  onCategoryChange: (v: string) => void;
  categories: string[];

  brand: string;
  onBrandChange: (v: string) => void;
  brands: string[];

  priceMin?: number;
  onPriceMinChange: (v?: number) => void;

  priceMax?: number;
  onPriceMaxChange: (v?: number) => void;

  priceMinPlaceholder: number;
  priceMaxPlaceholder: number;

  inStockOnly: boolean;
  onToggleInStock: () => void;

  page: number;
  totalPages: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;

  isLoading: boolean;
  isFetching: boolean;
};

export function ProductsToolbar(props: ProductsToolbarProps) {
  const {
    search,
    onSearchChange,
    sort,
    onSortChange,
    category,
    onCategoryChange,
    categories,
    brand,
    onBrandChange,
    brands,
    priceMin,
    onPriceMinChange,
    priceMax,
    onPriceMaxChange,
    priceMinPlaceholder,
    priceMaxPlaceholder,
    inStockOnly,
    onToggleInStock,
    page,
    totalPages,
    canPrev,
    canNext,
    onPrev,
    onNext,
    isLoading,
    isFetching,
  } = props;

  return (
    <div className="flex items-center justify-between mb-4 gap-4">
      <h1 className="text-2xl font-bold">Products</h1>

      <div className="flex items-center gap-3 flex-wrap justify-end">
        <input
          type="text"
          placeholder="Search product"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="px-4 py-2 rounded-xl border bg-white shadow w-80"
        />

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          className="px-4 py-2 rounded-xl border bg-white shadow"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating_desc">Rating</option>
        </select>

        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-4 py-2 rounded-xl border bg-white shadow"
          disabled={isLoading}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "Category" : c}
            </option>
          ))}
        </select>

        <select
          value={brand}
          onChange={(e) => onBrandChange(e.target.value)}
          className="px-4 py-2 rounded-xl border bg-white shadow"
          disabled={isLoading}
        >
          {brands.map((b) => (
            <option key={b} value={b}>
              {b === "all" ? "Brands" : b}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-white shadow">
          <span className="text-sm text-gray-600">Price</span>

          <input
            type="number"
            value={priceMin ?? ""}
            placeholder={`${priceMinPlaceholder}`}
            onChange={(e) =>
              onPriceMinChange(
                e.target.value === "" ? undefined : Number(e.target.value),
              )
            }
            className="w-20 text-sm border rounded-lg px-2 py-1"
            disabled={isLoading}
          />

          <span className="text-gray-400">-</span>

          <input
            type="number"
            value={priceMax ?? ""}
            placeholder={`${priceMaxPlaceholder}`}
            onChange={(e) =>
              onPriceMaxChange(
                e.target.value === "" ? undefined : Number(e.target.value),
              )
            }
            className="w-20 text-sm border rounded-lg px-2 py-1"
            disabled={isLoading}
          />
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={inStockOnly}
          onClick={onToggleInStock}
          className="flex items-center gap-3 px-3 py-2 rounded-xl border bg-white shadow select-none"
        >
          <span className="text-sm">In Stock</span>

          <span
            className={[
              "relative inline-flex h-6 w-11 items-center rounded-full transition",
              inStockOnly ? "bg-gray-900" : "bg-gray-300",
            ].join(" ")}
          >
            <span
              className={[
                "inline-block h-5 w-5 transform rounded-full bg-white transition",
                inStockOnly ? "translate-x-5" : "translate-x-1",
              ].join(" ")}
            />
          </span>
        </button>

        <button
          className="px-4 py-2 rounded-xl bg-white shadow disabled:opacity-50"
          onClick={onPrev}
          disabled={isLoading || !canPrev}
        >
          Prev
        </button>

        <div className="text-sm text-gray-600 whitespace-nowrap">
          Page <span className="font-semibold">{page}</span> / {totalPages}
          {isFetching && !isLoading ? (
            <span className="ml-2 text-gray-400">• Updating…</span>
          ) : null}
        </div>

        <button
          className="px-4 py-2 rounded-xl bg-white shadow disabled:opacity-50"
          onClick={onNext}
          disabled={isLoading || !canNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
