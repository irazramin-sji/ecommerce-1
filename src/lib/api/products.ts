import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/types";

export type ProductQueryOptions = {
  query?: string;
  category?: string;
  material?: string;
  shape?: string;
  length?: string;
  tip_size?: string;
  page?: number;
  limit?: number;
};

/**
 * Fetch products from Supabase using the seeded client.
 * Performs basic filtering and pagination.
 */
export async function fetchProducts(opts: ProductQueryOptions = {}) {
  const {
    query,
    category,
    material,
    shape,
    length,
    tip_size,
    page = 1,
    limit = 12,
  } = opts;

  let qb = supabase.from("products").select("*", { count: "exact" }).eq("is_active", true);

  if (query) {
    // simple ilike match on name and description
    qb = qb.ilike("name", `%${query}%`);
  }

  if (category) {
    // join via category slug: need to resolve category id first
    const { data: cats } = await supabase.from("categories").select("id").eq("slug", category).limit(1);
    if (cats && cats.length > 0) {
      qb = qb.eq("category_id", cats[0].id);
    }
  }

  if (material) qb = qb.eq("material", material);
  if (shape) qb = qb.eq("shape", shape);
  if (length) qb = qb.eq("length", length);
  if (tip_size) qb = qb.eq("tip_size", tip_size);

  // Pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  qb = qb.range(from, to).order("created_at", { ascending: false });

  const res = await qb;
  if (res.error) throw res.error;

  const products = res.data as Product[] ?? [];
  const total = res.count ?? products.length;

  return { products, total, page };
}

export async function fetchProductBySlug(slug: string) {
  const res = await supabase.from("products").select("*").eq("slug", slug).limit(1).single();
  if (res.error) throw res.error;
  return res.data as Product;
}
