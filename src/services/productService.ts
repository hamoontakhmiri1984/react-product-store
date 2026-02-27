import axios from "axios";
import type { ProductsResponse } from "../types/product";

const BASE_URL = "https://dummyjson.com";

export type FetchProductsParams = {
  limit: number;
  skip: number;
  q?: string;
  category?: string;
};

export const fetchProducts = async (
  params: FetchProductsParams,
): Promise<ProductsResponse> => {
  const { limit, skip, q, category } = params;

  let url = `${BASE_URL}/products`;

  if (q && q.trim()) {
    url = `${BASE_URL}/products/search`;
  }

  if (category) {
    url = `${BASE_URL}/products/category/${category}`;
  }

  const response = await axios.get<ProductsResponse>(url, {
    params: {
      limit,
      skip,
      ...(q ? { q: q.trim() } : {}),
    },
  });

  return response.data;
};
