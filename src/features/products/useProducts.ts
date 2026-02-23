import { useQuery } from "@tanstack/react-query";
import {
  fetchProducts,
  type FetchProductsParams,
} from "../../services/productService";
import type { ProductsResponse } from "../../types/product";

export const useProducts = (params: FetchProductsParams) => {
  return useQuery<ProductsResponse>({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params),
    staleTime: 60_000,
  });
};
