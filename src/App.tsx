import { useMemo, useState } from "react";
import { useProducts } from "./features/products/useProducts";
import { useProductsPageState } from "./features/products/useProductsPageState";
import { ProductsToolbar } from "./components/ProductsToolbar";
import { ProductCard } from "./components/ProductCard";
import { ProductModal } from "./components/ProductModal";
// import { ProductGridSkeleton } from "./components/ProductGridSkeleton";
import { FullPageLoader } from "./components/FullPageLoader";
import type { Product } from "./types/product";

const LIMIT = 12;

function App() {
  const { ui, setUi, skip, clearAll } = useProductsPageState();
  const [selected, setSelected] = useState<Product | null>(null);

  const params = useMemo(
    () => ({
      limit: LIMIT,
      skip,
      q: ui.debouncedSearch.length ? ui.debouncedSearch : undefined,
    }),
    [skip, ui.debouncedSearch],
  );

  const { data, isLoading, isError, isFetching, refetch } = useProducts(params);

  const totalPages = useMemo(() => {
    if (!data) return 1;
    return Math.max(1, Math.ceil(data.total / LIMIT));
  }, [data]);

  const canPrev = ui.page > 1;
  const canNext = ui.page < totalPages;

  const categories = useMemo(() => {
    const products = data?.products ?? [];
    const set = new Set(products.map((p) => p.category));
    const arr = ["all", ...Array.from(set).sort()];
    if (ui.category !== "all" && !arr.includes(ui.category))
      arr.splice(1, 0, ui.category);
    return arr;
  }, [data?.products, ui.category]);

  const brands = useMemo(() => {
    const products = data?.products ?? [];
    const set = new Set(products.map((p) => p.brand));
    const arr = ["all", ...Array.from(set).sort()];
    if (ui.brand !== "all" && !arr.includes(ui.brand))
      arr.splice(1, 0, ui.brand);
    return arr;
  }, [data?.products, ui.brand]);

  const priceBounds = useMemo(() => {
    const products = data?.products ?? [];
    if (products.length === 0) return { min: 0, max: 0 };
    let min = products[0].price;
    let max = products[0].price;
    for (const p of products) {
      if (p.price < min) min = p.price;
      if (p.price > max) max = p.price;
    }
    return { min, max };
  }, [data?.products]);

  const sortedProducts = useMemo(() => {
    const products = data?.products ?? [];
    const arr = [...products];

    switch (ui.sort) {
      case "price_asc":
        arr.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        arr.sort((a, b) => b.price - a.price);
        break;
      case "rating_desc":
        arr.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
      default:
        arr.sort((a, b) => b.id - a.id);
        break;
    }

    return arr;
  }, [data?.products, ui.sort]);

  const filteredProducts = useMemo(() => {
    let arr = [...sortedProducts];

    if (ui.inStockOnly) arr = arr.filter((p) => p.stock > 0);
    if (ui.category !== "all")
      arr = arr.filter((p) => p.category === ui.category);
    if (ui.brand !== "all") arr = arr.filter((p) => p.brand === ui.brand);
    if (ui.priceMin !== undefined)
      arr = arr.filter((p) => p.price >= (ui.priceMin ?? 0));
    if (ui.priceMax !== undefined)
      arr = arr.filter((p) => p.price <= (ui.priceMax ?? 0));

    return arr;
  }, [
    sortedProducts,
    ui.inStockOnly,
    ui.category,
    ui.brand,
    ui.priceMin,
    ui.priceMax,
  ]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-slate-950 dark:text-slate-100 p-6">
      {isFetching && !isLoading && (
        <div className="fixed top-0 left-0 h-1 w-full bg-gray-200 dark:bg-slate-800 z-50">
          <div className="h-full w-full bg-gray-900 dark:bg-slate-100 animate-pulse" />
        </div>
      )}
      <ProductsToolbar
        search={ui.search}
        onSearchChange={(v) => setUi((p) => ({ ...p, search: v }))}
        sort={ui.sort}
        onSortChange={(v) => setUi((p) => ({ ...p, sort: v }))}
        category={ui.category}
        onCategoryChange={(v) => setUi((p) => ({ ...p, category: v, page: 1 }))}
        categories={categories}
        brand={ui.brand}
        onBrandChange={(v) => setUi((p) => ({ ...p, brand: v, page: 1 }))}
        brands={brands}
        priceMin={ui.priceMin}
        onPriceMinChange={(v) => setUi((p) => ({ ...p, priceMin: v, page: 1 }))}
        priceMax={ui.priceMax}
        onPriceMaxChange={(v) => setUi((p) => ({ ...p, priceMax: v, page: 1 }))}
        priceMinPlaceholder={priceBounds.min}
        priceMaxPlaceholder={priceBounds.max}
        inStockOnly={ui.inStockOnly}
        onToggleInStock={() =>
          setUi((p) => ({ ...p, inStockOnly: !p.inStockOnly, page: 1 }))
        }
        page={ui.page}
        totalPages={totalPages}
        canPrev={canPrev}
        canNext={canNext}
        onPrev={() => setUi((p) => ({ ...p, page: p.page - 1 }))}
        onNext={() => setUi((p) => ({ ...p, page: p.page + 1 }))}
        isLoading={isLoading}
        isFetching={isFetching}
      />

      {/* Counter */}
      {!isLoading && !isError ? (
        <div className="mb-6 text-sm text-gray-600 dark:text-slate-300">
          Showing{" "}
          <span className="font-semibold">{filteredProducts.length}</span> of{" "}
          <span className="font-semibold">{sortedProducts.length}</span>
        </div>
      ) : (
        <div className="mb-6" />
      )}

      {isLoading ? (
        <FullPageLoader />
      ) : isError ? (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow border border-gray-100 dark:border-slate-800">
          <h2 className="text-lg font-bold">Something went wrong</h2>
          <p className="text-gray-600 dark:text-slate-300 mt-2">
            Couldn’t load products. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition
                       dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Retry
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-10 rounded-xl shadow text-center border border-gray-100 dark:border-slate-800">
          <div className="text-3xl">🧺</div>
          <h2 className="text-lg font-bold mt-2">No products found</h2>
          <p className="text-gray-600 dark:text-slate-300 mt-1">
            Try changing your search or filters.
          </p>

          <button
            onClick={clearAll}
            className="mt-4 px-4 py-2 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition
                       dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={setSelected}
            />
          ))}
        </div>
      )}

      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

export default App;
