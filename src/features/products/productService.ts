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
  let url = `${BASE_URL}/products/search`;

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
