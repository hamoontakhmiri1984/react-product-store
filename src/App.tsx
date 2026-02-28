import { useMemo, useState } from "react";
import {
  useProducts,
  useProductsPageState,
  getBrands,
  getCategories,
  getPriceBounds,
  sortProducts,
  filterProducts,
  paginate,
  type Product,
} from "./features/products";

import {
  ProductsToolbar,
  ProductCard,
  ProductModal,
  FullPageLoader,
  CartDrawer,
} from "./components";
import { Pagination } from "@mui/material";

const EMPTY_PRODUCTS: Product[] = [];
const PER_PAGE = 16;

function App() {
  const { ui, setUi, clearAll } = useProductsPageState();
  const [selected, setSelected] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const params = useMemo(
    () => ({
      limit: 200,
      skip: 0,
      q: ui.debouncedSearch || undefined,
    }),
    [ui.debouncedSearch],
  );

  const { data, isLoading, isError, isFetching, refetch } = useProducts(params);

  const products = data?.products ?? EMPTY_PRODUCTS;

  const categories = useMemo(() => getCategories(products), [products]);
  const brands = useMemo(() => getBrands(products), [products]);
  const priceBounds = useMemo(() => getPriceBounds(products), [products]);

  const sortedProducts = useMemo(
    () => sortProducts(products, ui.sort),
    [products, ui.sort],
  );

  const filteredProducts = useMemo(
    () =>
      filterProducts(sortedProducts, {
        inStockOnly: ui.inStockOnly,
        categories: ui.categories,
        brands: ui.brands,
        priceMin: ui.priceMin,
        priceMax: ui.priceMax,
      }),
    [
      sortedProducts,
      ui.inStockOnly,
      ui.categories,
      ui.brands,
      ui.priceMin,
      ui.priceMax,
    ],
  );

  const totalPages = Math.ceil(filteredProducts.length / PER_PAGE);
  const paginatedProducts = useMemo(
    () => paginate(filteredProducts, ui.page, PER_PAGE),
    [filteredProducts, ui.page],
  );
  const setPage = (page: number) => setUi((p) => ({ ...p, page }));
  const toggleInArray = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];

  const toggleCategory = (cat: string) =>
    setUi((p) => ({
      ...p,
      page: 1,
      categories: toggleInArray(p.categories, cat),
    }));

  const toggleBrand = (brand: string) =>
    setUi((p) => ({
      ...p,
      page: 1,
      brands: toggleInArray(p.brands, brand),
    }));

  const setSearch = (v: string) => setUi((p) => ({ ...p, search: v, page: 1 }));
  const setSort = (v: typeof ui.sort) =>
    setUi((p) => ({ ...p, sort: v, page: 1 }));

  const setPriceMin = (v?: number) =>
    setUi((p) => ({ ...p, priceMin: v, page: 1 }));
  const setPriceMax = (v?: number) =>
    setUi((p) => ({ ...p, priceMax: v, page: 1 }));

  const toggleStock = () =>
    setUi((p) => ({ ...p, inStockOnly: !p.inStockOnly, page: 1 }));
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-slate-950 dark:text-slate-100 p-6">
      {isFetching && !isLoading && (
        <div className="fixed top-0 left-0 h-1 w-full bg-gray-200 dark:bg-slate-800 z-50">
          <div className="h-full w-full bg-gray-900 dark:bg-slate-100 animate-pulse" />
        </div>
      )}
      <ProductsToolbar
        onOpenCart={() => setCartOpen(true)}
        onPageChange={setPage}
        totalCount={filteredProducts.length}
        search={ui.search}
        onSearchChange={setSearch}
        sort={ui.sort}
        onSortChange={setSort}
        categories={categories}
        selectedCategories={ui.categories}
        onToggleCategory={toggleCategory}
        brands={brands}
        selectedBrands={ui.brands}
        onToggleBrand={toggleBrand}
        priceMin={ui.priceMin}
        onPriceMinChange={setPriceMin}
        priceMax={ui.priceMax}
        onPriceMaxChange={setPriceMax}
        priceMinPlaceholder={priceBounds.min}
        priceMaxPlaceholder={priceBounds.max}
        inStockOnly={ui.inStockOnly}
        onToggleInStock={toggleStock}
        isLoading={isLoading}
        isFetching={isFetching}
        clearAll={clearAll}
        page={ui.page}
        totalPages={totalPages}
        canPrev={ui.page > 1}
        canNext={ui.page < totalPages}
        onPrev={() => setPage(ui.page - 1)}
        onNext={() => setPage(ui.page + 1)}
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
            onChange={(_, value) => setPage(value)}
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
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
export default App;
