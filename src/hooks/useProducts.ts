import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { fetchProducts, fetchProductBySlug, ProductQueryOptions } from "@/lib/api/products";

export function useProducts(options: ProductQueryOptions = {}) {
  const key = ["products", options];
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const res = await fetchProducts(options);
      return res;
    },
    keepPreviousData: true,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await fetchProductBySlug(slug);
      return res;
    },
    enabled: !!slug,
  });
}
