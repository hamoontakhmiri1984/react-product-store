import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchProducts, type FetchProductsParams } from "./productService";
import type { ProductsResponse } from "./types";
import { productKeys } from "./queryKeys";

export const useProducts = (params: FetchProductsParams) => {
  const keyParams: FetchProductsParams = {
    limit: params.limit,
    skip: params.skip,
    q: (params.q ?? "").trim(),
    category: params.category ?? "",
  };

  return useQuery<ProductsResponse>({
    queryKey: productKeys.list(keyParams),
    queryFn: () => fetchProducts(keyParams),
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
};
