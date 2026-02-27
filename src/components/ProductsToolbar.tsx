import { useState, useEffect, useRef } from "react";
import type { SortKey } from "../features/products/useProductsPageState";
import { ThemeToggle } from "./ThemeToggle";
import PriceRangeSlider from "./PriceRangeSlider";
import { Drawer, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useCartStore } from "../store/useCartStore";

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

  const [open, setOpen] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = (name: string) =>
    setOpen((prev) => (prev === name ? null : name));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(null);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const pill =
    "px-5 py-2.5 rounded-full border text-sm bg-white shadow-sm flex items-center gap-2 dark:bg-slate-900 dark:border-slate-700";

  const dropdown =
    "absolute mt-2 w-60 rounded-2xl border bg-white shadow-xl p-4 z-50 dark:bg-slate-900 dark:border-slate-700";
  // const totalItems = useCartStore((state) => state.totalItems);
  const totalItems = useCartStore((s) => s.totalItems());
  return (
    <div ref={wrapperRef} className="mb-10">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* بالا */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-slate-400">
            {isFetching && !isLoading && "در حال بروزرسانی..."}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCart}
              className="relative h-10 w-10 rounded-full
              bg-gray-100 dark:bg-slate-800
              flex items-center justify-center
              hover:bg-gray-200 dark:hover:bg-slate-700
              transition"
            >
              🛒
              {totalItems > 0 && (
                // <span
                //   className="absolute -top-1 -right-1
                //   min-w-18px h-18px
                //   px-1 rounded-full
                //   bg-red-700 text-white
                //   dark:bg-red-700 dark:text-white
                //   text-[10px] font-semibold
                //   flex items-center justify-center"
                // >
                //   {totalItems}
                // </span>
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

        {/* سرچ */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="text-sm text-gray-600 dark:text-slate-300">
            <span className="font-semibold">{totalCount}</span> Products
          </div>

          <input
            type="text"
            placeholder="Search product"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full md:flex-1 px-6 py-3 rounded-full border shadow-sm bg-white dark:bg-slate-900 dark:border-slate-700"
          />
        </div>

        {/* فیلترها */}
        {!isMobile && (
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              {/* Sort */}
              <div className="relative">
                <button onClick={() => toggle("sort")} className={pill}>
                  {sortLabel(sort)}
                  <Arrow open={open === "sort"} />
                </button>

                {open === "sort" && (
                  <div className={dropdown}>
                    {[
                      { value: "newest", label: "Newest" },
                      { value: "price_asc", label: "Price: Low to High" },
                      { value: "price_desc", label: "Price: High to Low" },
                      { value: "rating_desc", label: "Rating" },
                      { value: "discount_desc", label: "Most Discount" },
                    ].map((item) => (
                      <button
                        key={item.value}
                        onClick={() => {
                          onSortChange(item.value as SortKey);
                          setOpen(null);
                        }}
                        className="block w-full text-left py-2 text-sm hover:font-semibold"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Category */}
              <div className="relative">
                <button onClick={() => toggle("cat")} className={pill}>
                  Category
                  <Arrow open={open === "cat"} />
                </button>

                {open === "cat" && (
                  <div className={dropdown}>
                    {categories.map((c) => (
                      <label key={c} className="flex gap-2 text-sm mb-2">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(c)}
                          onChange={() => onToggleCategory(c)}
                        />
                        {c}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Brand */}
              <div className="relative">
                <button onClick={() => toggle("brand")} className={pill}>
                  Brands
                  <Arrow open={open === "brand"} />
                </button>

                {open === "brand" && (
                  <div className={dropdown}>
                    {brands.map((b) => (
                      <label key={b} className="flex gap-2 text-sm mb-2">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(b)}
                          onChange={() => onToggleBrand(b)}
                        />
                        {b}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="relative">
                <button onClick={() => toggle("price")} className={pill}>
                  Price
                  <Arrow open={open === "price"} />
                </button>

                {open === "price" && (
                  <div className={dropdown + " space-y-3"}>
                    {/* <input
                    type="number"
                    placeholder={`Min (${priceMinPlaceholder})`}
                    value={priceMin ?? ""}
                    onChange={(e) =>
                      onPriceMinChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                  /> */}
                    <PriceRangeSlider
                      priceMin={priceMin ?? priceMinPlaceholder}
                      priceMax={priceMax ?? priceMaxPlaceholder}
                      onPriceMinChange={onPriceMinChange}
                      onPriceMaxChange={onPriceMaxChange}
                    />
                    {/* <input
                    type="number"
                    placeholder={`Max (${priceMaxPlaceholder})`}
                    value={priceMax ?? ""}
                    onChange={(e) =>
                      onPriceMaxChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                  /> */}
                  </div>
                )}
              </div>

              {/* Clear */}
              <button
                onClick={clearAll}
                className="text-sm text-gray-500 hover:text-black dark:hover:text-white"
              >
                Clear filters
              </button>
            </div>

            {/* In Stock */}
            <button
              type="button"
              onClick={onToggleInStock}
              className="flex items-center gap-3"
            >
              <span className="text-sm">In Stock</span>
              <span
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  inStockOnly ? "bg-black dark:bg-white" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                    inStockOnly ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </span>
            </button>
          </div>
        )}
        {/* موبایل */}
        {isMobile && (
          <>
            <button
              onClick={() => setMobileOpen(true)}
              className="w-full px-6 py-3 rounded-full border bg-white dark:bg-slate-900 dark:border-slate-700"
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
                },
              }}
            >
              <div className="space-y-6 overflow-y-auto">
                {/* اینجا فقط محتوای dropdown ها رو کپی کن */}

                {/* Sort */}
                <div>
                  <div className="font-semibold mb-2">Sort</div>
                  {[
                    { value: "newest", label: "Newest" },
                    { value: "price_asc", label: "Price: Low to High" },
                    { value: "price_desc", label: "Price: High to Low" },
                    { value: "rating_desc", label: "Rating" },
                    { value: "discount_desc", label: "Most Discount" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => onSortChange(item.value as SortKey)}
                      className="block w-full text-left py-2 text-sm"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Category */}
                <div>
                  <div className="font-semibold mb-2">Category</div>
                  {categories.map((c) => (
                    <label key={c} className="flex gap-2 text-sm mb-2">
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
                    <label key={b} className="flex gap-2 text-sm mb-2">
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
                    onPriceMinChange={onPriceMinChange}
                    onPriceMaxChange={onPriceMaxChange}
                  />
                </div>

                <button
                  onClick={clearAll}
                  className="text-sm text-gray-500 hover:text-black dark:hover:text-white"
                >
                  Clear filters
                </button>
              </div>
            </Drawer>
          </>
        )}
      </div>
    </div>
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
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}
