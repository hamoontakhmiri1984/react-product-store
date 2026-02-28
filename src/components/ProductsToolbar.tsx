import { useEffect, useMemo, useRef, useState } from "react";
import type { SortKey } from "../features/products/useProductsPageState";
import { ThemeToggle } from "./ThemeToggle";
import PriceRangeSlider from "./PriceRangeSlider";
import { Drawer, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { selectTotalItems, useCartStore } from "../store/useCartStore";

type ProductsToolbarProps = {
  page: number;
  totalPages: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onPageChange: (page: number) => void;

  search: string;
  onSearchChange: (v: string) => void;
  totalCount: number;

  sort: SortKey;
  onSortChange: (v: SortKey) => void;

  categories: string[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;

  brands: string[];
  selectedBrands: string[];
  onToggleBrand: (brand: string) => void;

  priceMin?: number;
  onPriceMinChange: (v?: number) => void;

  priceMax?: number;
  onPriceMaxChange: (v?: number) => void;

  priceMinPlaceholder: number;
  priceMaxPlaceholder: number;

  inStockOnly: boolean;
  onToggleInStock: () => void;

  clearAll: () => void;

  isLoading: boolean;
  isFetching: boolean;

  onOpenCart: () => void;
};

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating_desc", label: "Rating" },
  { value: "discount_desc", label: "Most Discount" },
];

type OpenKey = "sort" | "cat" | "brand" | "price" | null;

export function ProductsToolbar(props: ProductsToolbarProps) {
  const {
    search,
    onSearchChange,
    totalCount,
    sort,
    onSortChange,
    categories,
    selectedCategories,
    onToggleCategory,
    brands,
    selectedBrands,
    onToggleBrand,
    priceMin,
    onPriceMinChange,
    priceMax,
    onPriceMaxChange,
    priceMinPlaceholder,
    priceMaxPlaceholder,
    inStockOnly,
    onToggleInStock,
    clearAll,
    isFetching,
    isLoading,
    onOpenCart,
  } = props;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<OpenKey>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const totalItems = useCartStore(selectTotalItems);
  const pill =
    "px-5 py-2.5 rounded-full border text-sm bg-white shadow-sm flex items-center gap-2 " +
    "dark:bg-slate-900 dark:border-slate-700 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 dark:focus-visible:ring-white/20";

  const dropdown =
    "absolute mt-2 w-60 rounded-2xl border bg-white shadow-xl p-4 z-50 " +
    "dark:bg-slate-900 dark:border-slate-700";

  const toggle = (name: Exclude<OpenKey, null>) =>
    setOpen((prev) => (prev === name ? null : name));

  // close desktop dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const loadingText = useMemo(() => {
    if (isFetching && !isLoading) return "Loading...";
    return "";
  }, [isFetching, isLoading]);

  return (
    <div ref={wrapperRef} className="mb-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <TopBar
          loadingText={loadingText}
          totalItems={totalItems}
          onOpenCart={onOpenCart}
        />

        <SearchRow
          totalCount={totalCount}
          search={search}
          onSearchChange={onSearchChange}
        />

        {!isMobile ? (
          <DesktopFilters
            pillClassName={pill}
            dropdownClassName={dropdown}
            open={open}
            onToggle={toggle}
            onCloseAll={() => setOpen(null)}
            sort={sort}
            onSortChange={onSortChange}
            categories={categories}
            selectedCategories={selectedCategories}
            onToggleCategory={onToggleCategory}
            brands={brands}
            selectedBrands={selectedBrands}
            onToggleBrand={onToggleBrand}
            priceMin={priceMin}
            priceMax={priceMax}
            priceMinPlaceholder={priceMinPlaceholder}
            priceMaxPlaceholder={priceMaxPlaceholder}
            onPriceMinChange={onPriceMinChange}
            onPriceMaxChange={onPriceMaxChange}
            inStockOnly={inStockOnly}
            onToggleInStock={onToggleInStock}
            clearAll={clearAll}
          />
        ) : (
          <MobileFilters
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
            sort={sort}
            onSortChange={onSortChange}
            categories={categories}
            selectedCategories={selectedCategories}
            onToggleCategory={onToggleCategory}
            brands={brands}
            selectedBrands={selectedBrands}
            onToggleBrand={onToggleBrand}
            priceMin={priceMin}
            priceMax={priceMax}
            priceMinPlaceholder={priceMinPlaceholder}
            priceMaxPlaceholder={priceMaxPlaceholder}
            onPriceMinChange={onPriceMinChange}
            onPriceMaxChange={onPriceMaxChange}
            inStockOnly={inStockOnly}
            onToggleInStock={onToggleInStock}
            clearAll={clearAll}
          />
        )}
      </div>
    </div>
  );
}

function TopBar({
  loadingText,
  totalItems,
  onOpenCart,
}: {
  loadingText: string;
  totalItems: number;
  onOpenCart: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-500 dark:text-slate-400">
        {loadingText}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenCart}
          aria-label="Open cart"
          className="relative h-10 w-10 rounded-full
          bg-gray-100 dark:bg-slate-800
          flex items-center justify-center
          hover:bg-gray-200 dark:hover:bg-slate-700
          transition
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 dark:focus-visible:ring-white/20"
        >
          🛒
          {totalItems > 0 && (
            <span
              className="absolute -top-1 -right-1
              min-w-18px h-18px
              px-1 rounded-full
              bg-red-700 text-white
              text-[10px] font-semibold
              flex items-center justify-center"
            >
              {totalItems}
            </span>
          )}
        </button>

        <ThemeToggle />
      </div>
    </div>
  );
}

function SearchRow({
  totalCount,
  search,
  onSearchChange,
}: {
  totalCount: number;
  search: string;
  onSearchChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
      <div className="text-sm text-gray-600 dark:text-slate-300">
        <span className="font-semibold">{totalCount}</span> Products
      </div>

      <input
        type="text"
        placeholder="Search product"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full md:flex-1 px-6 py-3 rounded-full border shadow-sm
        bg-white dark:bg-slate-900 dark:border-slate-700
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 dark:focus-visible:ring-white/20"
      />
    </div>
  );
}

function DesktopFilters(props: {
  pillClassName: string;
  dropdownClassName: string;
  open: OpenKey;
  onToggle: (k: Exclude<OpenKey, null>) => void;
  onCloseAll: () => void;

  sort: SortKey;
  onSortChange: (v: SortKey) => void;

  categories: string[];
  selectedCategories: string[];
  onToggleCategory: (c: string) => void;

  brands: string[];
  selectedBrands: string[];
  onToggleBrand: (b: string) => void;

  priceMin?: number;
  priceMax?: number;
  priceMinPlaceholder: number;
  priceMaxPlaceholder: number;
  onPriceMinChange: (v?: number) => void;
  onPriceMaxChange: (v?: number) => void;

  inStockOnly: boolean;
  onToggleInStock: () => void;

  clearAll: () => void;
}) {
  const {
    pillClassName,
    dropdownClassName,
    open,
    onToggle,
    onCloseAll,
    sort,
    onSortChange,
    categories,
    selectedCategories,
    onToggleCategory,
    brands,
    selectedBrands,
    onToggleBrand,
    priceMin,
    priceMax,
    priceMinPlaceholder,
    priceMaxPlaceholder,
    onPriceMinChange,
    onPriceMaxChange,
    inStockOnly,
    onToggleInStock,
    clearAll,
  } = props;

  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-4 flex-wrap">
        <ToolbarDropdown
          label={sortLabel(sort)}
          open={open === "sort"}
          pillClassName={pillClassName}
          dropdownClassName={dropdownClassName}
          onToggle={() => onToggle("sort")}
        >
          {SORT_OPTIONS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                onSortChange(item.value);
                onCloseAll();
              }}
              className="block w-full text-left py-2 text-sm hover:font-semibold
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 dark:focus-visible:ring-white/10 rounded"
            >
              {item.label}
            </button>
          ))}
        </ToolbarDropdown>

        <ToolbarDropdown
          label="Category"
          open={open === "cat"}
          pillClassName={pillClassName}
          dropdownClassName={dropdownClassName}
          onToggle={() => onToggle("cat")}
        >
          {categories.map((c) => (
            <label key={c} className="flex gap-2 text-sm mb-2 select-none">
              <input
                type="checkbox"
                checked={selectedCategories.includes(c)}
                onChange={() => onToggleCategory(c)}
              />
              {c}
            </label>
          ))}
        </ToolbarDropdown>

        <ToolbarDropdown
          label="Brands"
          open={open === "brand"}
          pillClassName={pillClassName}
          dropdownClassName={dropdownClassName}
          onToggle={() => onToggle("brand")}
        >
          {brands.map((b) => (
            <label key={b} className="flex gap-2 text-sm mb-2 select-none">
              <input
                type="checkbox"
                checked={selectedBrands.includes(b)}
                onChange={() => onToggleBrand(b)}
              />
              {b}
            </label>
          ))}
        </ToolbarDropdown>

        <ToolbarDropdown
          label="Price"
          open={open === "price"}
          pillClassName={pillClassName}
          dropdownClassName={dropdownClassName + " space-y-3"}
          onToggle={() => onToggle("price")}
        >
          <PriceRangeSlider
            priceMin={priceMin ?? priceMinPlaceholder}
            priceMax={priceMax ?? priceMaxPlaceholder}
            onPriceMinChange={(v) => onPriceMinChange(v)}
            onPriceMaxChange={(v) => onPriceMaxChange(v)}
          />
        </ToolbarDropdown>

        <button
          type="button"
          onClick={clearAll}
          className="text-sm text-gray-500 hover:text-black dark:hover:text-white
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 dark:focus-visible:ring-white/10 rounded px-1"
        >
          Clear filters
        </button>
      </div>

      <InStockToggle inStockOnly={inStockOnly} onToggle={onToggleInStock} />
    </div>
  );
}

function MobileFilters(props: {
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;

  sort: SortKey;
  onSortChange: (v: SortKey) => void;

  categories: string[];
  selectedCategories: string[];
  onToggleCategory: (c: string) => void;

  brands: string[];
  selectedBrands: string[];
  onToggleBrand: (b: string) => void;

  priceMin?: number;
  priceMax?: number;
  priceMinPlaceholder: number;
  priceMaxPlaceholder: number;
  onPriceMinChange: (v?: number) => void;
  onPriceMaxChange: (v?: number) => void;

  inStockOnly: boolean;
  onToggleInStock: () => void;

  clearAll: () => void;
}) {
  const {
    mobileOpen,
    setMobileOpen,
    sort,
    onSortChange,
    categories,
    selectedCategories,
    onToggleCategory,
    brands,
    selectedBrands,
    onToggleBrand,
    priceMin,
    priceMax,
    priceMinPlaceholder,
    priceMaxPlaceholder,
    onPriceMinChange,
    onPriceMaxChange,
    inStockOnly,
    onToggleInStock,
    clearAll,
  } = props;

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="w-full px-6 py-3 rounded-full border bg-white dark:bg-slate-900 dark:border-slate-700
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 dark:focus-visible:ring-white/20"
      >
        Filters
      </button>

      <Drawer
        anchor="bottom"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            p: 3,
            maxHeight: "85vh",
            bgcolor: "background.paper",
          },
        }}
      >
        <div className="space-y-6 overflow-y-auto">
          {/* Sort */}
          <div>
            <div className="font-semibold mb-2">Sort</div>
            {SORT_OPTIONS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  onSortChange(item.value);
                  setMobileOpen(false);
                }}
                className={`block w-full text-left py-2 text-sm rounded
                ${item.value === sort ? "font-semibold" : ""}
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 dark:focus-visible:ring-white/10`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Category */}
          <div>
            <div className="font-semibold mb-2">Category</div>
            {categories.map((c) => (
              <label key={c} className="flex gap-2 text-sm mb-2 select-none">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(c)}
                  onChange={() => onToggleCategory(c)}
                />
                {c}
              </label>
            ))}
          </div>

          {/* Brand */}
          <div>
            <div className="font-semibold mb-2">Brands</div>
            {brands.map((b) => (
              <label key={b} className="flex gap-2 text-sm mb-2 select-none">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(b)}
                  onChange={() => onToggleBrand(b)}
                />
                {b}
              </label>
            ))}
          </div>

          {/* Price */}
          <div>
            <div className="font-semibold mb-2">Price</div>
            <PriceRangeSlider
              priceMin={priceMin ?? priceMinPlaceholder}
              priceMax={priceMax ?? priceMaxPlaceholder}
              onPriceMinChange={(v) => onPriceMinChange(v)}
              onPriceMaxChange={(v) => onPriceMaxChange(v)}
            />
          </div>

          <InStockToggle inStockOnly={inStockOnly} onToggle={onToggleInStock} />

          <button
            type="button"
            onClick={() => {
              clearAll();
              setMobileOpen(false);
            }}
            className="text-sm text-gray-500 hover:text-black dark:hover:text-white
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 dark:focus-visible:ring-white/10 rounded px-1"
          >
            Clear filters
          </button>
        </div>
      </Drawer>
    </>
  );
}

function ToolbarDropdown({
  label,
  open,
  onToggle,
  pillClassName,
  dropdownClassName,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  pillClassName: string;
  dropdownClassName: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <button type="button" onClick={onToggle} className={pillClassName}>
        {label}
        <Arrow open={open} />
      </button>

      {open && <div className={dropdownClassName}>{children}</div>}
    </div>
  );
}

function InStockToggle({
  inStockOnly,
  onToggle,
}: {
  inStockOnly: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-3
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 dark:focus-visible:ring-white/10 rounded px-1"
    >
      <span className="text-sm">In Stock</span>

      <span
        className={`
        relative inline-flex h-6 w-11 items-center
        rounded-full transition border
        ${
          inStockOnly
            ? "bg-black border-black dark:bg-white dark:border-white"
            : "bg-gray-300 border-gray-300 dark:bg-slate-700 dark:border-slate-500"
        }
      `}
        aria-hidden="true"
      >
        <span
          className={`
          inline-block h-5 w-5 transform rounded-full
          bg-white dark:bg-slate-950
          border border-black/10 dark:border-white/10
          transition
          ${inStockOnly ? "translate-x-5" : "translate-x-1"}
        `}
        />
      </span>
    </button>
  );
}

function sortLabel(sort: SortKey) {
  switch (sort) {
    case "price_asc":
      return "Price: Low to High";
    case "price_desc":
      return "Price: High to Low";
    case "rating_desc":
      return "Rating";
    case "discount_desc":
      return "Most Discount";
    default:
      return "Newest";
  }
}

function Arrow({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}
