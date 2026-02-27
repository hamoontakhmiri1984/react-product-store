import { useMemo, useState } from "react";
import { useProducts } from "./features/products/useProducts";
import { useProductsPageState } from "./features/products/useProductsPageState";
import { ProductsToolbar } from "./components/ProductsToolbar";
import { ProductCard } from "./components/ProductCard";
import { ProductModal } from "./components/ProductModal";
import { FullPageLoader } from "./components/FullPageLoader";
import type { Product } from "./types/product";
import Pagination from "@mui/material/Pagination";

const PER_PAGE = 16;

function App() {
  const { ui, setUi, clearAll } = useProductsPageState();
  const [selected, setSelected] = useState<Product | null>(null);

  const params = useMemo(
    () => ({
      limit: 1000,
      skip: 0,
      q: ui.debouncedSearch || undefined,
    }),
    [ui.debouncedSearch],
  );

  const { data, isLoading, isError, isFetching, refetch } = useProducts(params);

  const categories = useMemo(() => {
    const products = data?.products ?? [];
    return Array.from(new Set(products.map((p) => p.category))).sort();
  }, [data?.products]);

  const brands = useMemo(() => {
    const products = data?.products ?? [];
    return Array.from(new Set(products.map((p) => p.brand))).sort();
  }, [data?.products]);

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
    const arr = [...(data?.products ?? [])];

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
      case "discount_desc":
        arr.sort(
          (a, b) => (b.discountPercentage ?? 0) - (a.discountPercentage ?? 0),
        );
        break;
      default:
        arr.sort((a, b) => b.id - a.id);
    }

    return arr;
  }, [data?.products, ui.sort]);

  const filteredProducts = useMemo(() => {
    let arr = [...sortedProducts];

    if (ui.inStockOnly) {
      arr = arr.filter((p) => p.stock > 0);
    }

    if (ui.categories.length > 0) {
      arr = arr.filter((p) => ui.categories.includes(p.category));
    }

    if (ui.brands.length > 0) {
      arr = arr.filter((p) => ui.brands.includes(p.brand));
    }

    if (ui.priceMin !== undefined) {
      const min = ui.priceMin;
      arr = arr.filter((p) => p.price >= min);
    }

    if (ui.priceMax !== undefined) {
      const max = ui.priceMax;
      arr = arr.filter((p) => p.price <= max);
    }

    return arr;
  }, [
    sortedProducts,
    ui.inStockOnly,
    ui.categories,
    ui.brands,
    ui.priceMin,
    ui.priceMax,
  ]);

  // Total pages calculation
  const totalPages = Math.ceil(filteredProducts.length / PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (ui.page - 1) * PER_PAGE;
    const end = start + PER_PAGE;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, ui.page]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-slate-950 dark:text-slate-100 p-6">
      {isFetching && !isLoading && (
        <div className="fixed top-0 left-0 h-1 w-full bg-gray-200 dark:bg-slate-800 z-50">
          <div className="h-full w-full bg-gray-900 dark:bg-slate-100 animate-pulse" />
        </div>
      )}

      <ProductsToolbar
        onPageChange={(newPage) =>
          setUi((prev) => ({ ...prev, page: newPage }))
        }
        totalCount={filteredProducts.length}
        search={ui.search}
        onSearchChange={(v) => setUi((p) => ({ ...p, search: v }))}
        sort={ui.sort}
        onSortChange={(v) => setUi((p) => ({ ...p, sort: v }))}
        categories={categories}
        selectedCategories={ui.categories}
        onToggleCategory={(cat) =>
          setUi((p) => ({
            ...p,
            page: 1,
            categories: p.categories.includes(cat)
              ? p.categories.filter((c) => c !== cat)
              : [...p.categories, cat],
          }))
        }
        brands={brands}
        selectedBrands={ui.brands}
        onToggleBrand={(brand) =>
          setUi((p) => ({
            ...p,
            page: 1,
            brands: p.brands.includes(brand)
              ? p.brands.filter((b) => b !== brand)
              : [...p.brands, brand],
          }))
        }
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
        isLoading={isLoading}
        isFetching={isFetching}
        clearAll={clearAll}
        page={ui.page} // ارسال صفحه جاری
        totalPages={totalPages} // ارسال تعداد کل صفحات
        canPrev={ui.page > 1}
        canNext={ui.page < totalPages}
        onPrev={() => setUi((p) => ({ ...p, page: p.page - 1 }))}
        onNext={() => setUi((p) => ({ ...p, page: p.page + 1 }))}
      />

      {!isLoading && !isError && (
        <div className="max-w-5xl mx-auto mb-6 text-sm text-gray-600 dark:text-slate-300">
          <span className="font-semibold">{filteredProducts.length}</span>{" "}
          Products
        </div>
      )}

      {isLoading ? (
        <FullPageLoader />
      ) : isError ? (
        <div className="max-w-5xl mx-auto p-8 bg-white dark:bg-slate-900 rounded-xl shadow">
          <h2 className="font-bold text-lg">Something went wrong</h2>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-black text-white rounded-xl"
          >
            Retry
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="max-w-5xl mx-auto p-10 bg-white dark:bg-slate-900 rounded-xl text-center">
          <h2 className="font-bold">No products found</h2>
          <button
            onClick={clearAll}
            className="mt-4 px-4 py-2 bg-black text-white rounded-xl"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr">
          {paginatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={setSelected}
            />
          ))}
        </div>
      )}

      {selected && (
        <ProductModal
          key={selected.id}
          product={selected}
          onClose={() => setSelected(null)}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 w-full">
          <Pagination
            count={totalPages}
            page={ui.page}
            onChange={(_, value) => setUi((p) => ({ ...p, page: value }))}
            shape="rounded"
            showFirstButton
            showLastButton
            sx={{
              "& .MuiPaginationItem-root": {
                color: "inherit",
              },
              "& .Mui-selected": {
                backgroundColor: "#111",
                color: "#fff",
              },
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
