import type { Product } from "./types";

export function getCategories(products: Product[]) {
  return Array.from(new Set(products.map((p) => p.category))).sort();
}

export function getBrands(products: Product[]) {
  return Array.from(new Set(products.map((p) => p.brand))).sort();
}

export function getPriceBounds(products: Product[]) {
  if (products.length === 0) return { min: 0, max: 0 };

  let min = products[0].price;
  let max = products[0].price;

  for (const p of products) {
    if (p.price < min) min = p.price;
    if (p.price > max) max = p.price;
  }

  return { min, max };
}

export type SortKey =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "rating_desc"
  | "discount_desc";

export function sortProducts(products: Product[], sort: SortKey) {
  const arr = [...products];

  switch (sort) {
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
      // newest
      arr.sort((a, b) => b.id - a.id);
  }

  return arr;
}

export type ProductFilters = {
  inStockOnly: boolean;
  categories: string[];
  brands: string[];
  priceMin?: number;
  priceMax?: number;
};

export function filterProducts(products: Product[], filters: ProductFilters) {
  let arr = [...products];

  if (filters.inStockOnly) arr = arr.filter((p) => p.stock > 0);

  if (filters.categories.length > 0) {
    arr = arr.filter((p) => filters.categories.includes(p.category));
  }

  if (filters.brands.length > 0) {
    arr = arr.filter((p) => filters.brands.includes(p.brand));
  }

  if (filters.priceMin !== undefined) {
    arr = arr.filter((p) => p.price >= filters.priceMin!);
  }

  if (filters.priceMax !== undefined) {
    arr = arr.filter((p) => p.price <= filters.priceMax!);
  }

  return arr;
}

export function paginate<T>(items: T[], page: number, perPage: number) {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return items.slice(start, end);
}
