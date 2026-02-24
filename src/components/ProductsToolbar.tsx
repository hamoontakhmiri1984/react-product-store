import type { SortKey } from "../features/products/useProductsPageState";
import { ThemeToggle } from "./ThemeToggle";

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

  const inputClass =
    "px-4 py-2 rounded-xl border shadow bg-white text-gray-900 placeholder:text-gray-400 " +
    "dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400 dark:border-slate-700";

  const selectClass =
    "px-4 py-2 rounded-xl border shadow bg-white text-gray-900 " +
    "dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700";

  const chipClass =
    "flex items-center gap-2 px-3 py-2 rounded-xl border shadow bg-white " +
    "dark:bg-slate-900 dark:border-slate-700";

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold dark:text-slate-100">Products</h1>
        <div className="md:hidden">
          <ThemeToggle />
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap md:justify-end">
        <input
          type="text"
          placeholder="Search product"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`${inputClass} w-full md:w-80`}
        />

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          className={selectClass}
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating_desc">Rating</option>
        </select>

        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className={selectClass}
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
          className={selectClass}
          disabled={isLoading}
        >
          {brands.map((b) => (
            <option key={b} value={b}>
              {b === "all" ? "Brands" : b}
            </option>
          ))}
        </select>

        <div className={chipClass}>
          <span className="text-sm text-gray-600 dark:text-slate-300">
            Price
          </span>

          <input
            type="number"
            value={priceMin ?? ""}
            placeholder={`${priceMinPlaceholder}`}
            onChange={(e) =>
              onPriceMinChange(
                e.target.value === "" ? undefined : Number(e.target.value),
              )
            }
            className="w-20 text-sm border rounded-lg px-2 py-1 bg-white
                       dark:bg-slate-950 dark:text-slate-100 dark:border-slate-700"
            disabled={isLoading}
          />

          <span className="text-gray-400 dark:text-slate-500">-</span>

          <input
            type="number"
            value={priceMax ?? ""}
            placeholder={`${priceMaxPlaceholder}`}
            onChange={(e) =>
              onPriceMaxChange(
                e.target.value === "" ? undefined : Number(e.target.value),
              )
            }
            className="w-20 text-sm border rounded-lg px-2 py-1 bg-white
                       dark:bg-slate-950 dark:text-slate-100 dark:border-slate-700"
            disabled={isLoading}
          />
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={inStockOnly}
          onClick={onToggleInStock}
          className={`${chipClass} select-none gap-3`}
        >
          <span className="text-sm dark:text-slate-200">In Stock</span>

          <span
            className={[
              "relative inline-flex h-6 w-11 items-center rounded-full transition",
              inStockOnly
                ? "bg-gray-900 dark:bg-slate-100"
                : "bg-gray-300 dark:bg-slate-700",
            ].join(" ")}
          >
            <span
              className={[
                "inline-block h-5 w-5 transform rounded-full transition",
                inStockOnly
                  ? "translate-x-5 bg-white dark:bg-slate-900"
                  : "translate-x-1 bg-white dark:bg-slate-200",
              ].join(" ")}
            />
          </span>
        </button>

        <button
          className="px-4 py-2 rounded-xl bg-white shadow border border-gray-200 disabled:opacity-50
                     dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
          onClick={onPrev}
          disabled={isLoading || !canPrev}
        >
          Prev
        </button>

        <div className="text-sm text-gray-600 dark:text-slate-300 whitespace-nowrap">
          Page <span className="font-semibold">{page}</span> / {totalPages}
          {isFetching && !isLoading ? (
            <span className="ml-2 text-gray-400 dark:text-slate-400">
              • Updating…
            </span>
          ) : null}
        </div>

        <button
          className="px-4 py-2 rounded-xl bg-white shadow border border-gray-200 disabled:opacity-50
                     dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
          onClick={onNext}
          disabled={isLoading || !canNext}
        >
          Next
        </button>

        <div className="hidden md:block">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
