import axios from "axios";
import type { ProductsResponse } from "../types/product";

const BASE_URL = "https://dummyjson.com";

export type FetchProductsParams = {
  limit?: number;
  skip?: number;
  q?: string;
};

export const fetchProducts = async (
  params: FetchProductsParams = {},
): Promise<ProductsResponse> => {
  const { limit = 12, skip = 0, q } = params;

  const isSearching = Boolean(q && q.trim().length > 0);

  const url = isSearching
    ? `${BASE_URL}/products/search`
    : `${BASE_URL}/products`;

  const response = await axios.get<ProductsResponse>(url, {
    params: isSearching ? { q: q!.trim(), limit, skip } : { limit, skip },
  });

  return response.data;
};
