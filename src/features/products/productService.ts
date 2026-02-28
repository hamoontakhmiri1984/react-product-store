import axios from "axios";
import type { ProductsResponse } from "./types";

const BASE_URL = "https://dummyjson.com";

export type FetchProductsParams = {
  limit: number;
  skip: number;
  q?: string;
  category?: string;
};

export const fetchProducts = async ({
  limit,
  skip,
  q,
  category,
}: FetchProductsParams): Promise<ProductsResponse> => {
  const trimmedQuery = q?.trim();

  const url = trimmedQuery
    ? `${BASE_URL}/products/search`
    : category
      ? `${BASE_URL}/products/category/${encodeURIComponent(category)}`
      : `${BASE_URL}/products`;

  const params = {
    limit,
    skip,
    ...(trimmedQuery ? { q: trimmedQuery } : {}),
  };

  const { data } = await axios.get<ProductsResponse>(url, { params });
  return data;
};
