import React, { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import ProductGrid from "@/components/store/ProductGrid";
import { useProducts } from "@/hooks/useProducts";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import SearchBar from "@/components/store/SearchBar";

export default function HomePage() {
  const [query, setQuery] = useState<string>("");
  const { data, isLoading, isError } = useProducts({ query, limit: 12 });
  const { user } = useAuth();

  return (
    <PageLayout>
      <PageLayout.Header>
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="text-xl font-bold">Norralco</Link>
          <div className="flex items-center gap-4">
            <SearchBar value={query} onChange={setQuery} />
            <Link to="/cart" className="px-3 py-1 rounded bg-primary text-white">Cart</Link>
            {user ? <Link to="/account" className="px-3 py-1">My Account</Link> : <Link to="/login" className="px-3 py-1">Login</Link>}
          </div>
        </div>
      </PageLayout.Header>

      <PageLayout.Content>
        <section className="my-6">
          <div className="rounded-lg bg-gradient-to-r from-primary/20 to-transparent p-6">
            <h1 className="text-3xl font-bold mb-2">High-quality surgical, dental, and veterinary instruments</h1>
            <p className="text-muted-foreground">Trusted by clinicians and hospitals worldwide. Browse our catalog.</p>
            <div className="mt-4">
              <Link to="/category/surgical" className="btn btn-primary mr-2">Shop Surgical</Link>
              <Link to="/category/dental" className="btn btn-outline">Shop Dental</Link>
            </div>
          </div>
        </section>

        <section className="my-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Featured Products</h2>
            <Link to="/catalog" className="text-sm text-primary">View all</Link>
          </div>

          {isLoading ? (
            <div>Loading products...</div>
          ) : isError ? (
            <div className="text-destructive">Failed to load products.</div>
          ) : data?.products?.length ? (
            <ProductGrid products={data.products} />
          ) : (
            <div className="p-6 bg-card rounded">No products found.</div>
          )}
        </section>
      </PageLayout.Content>
    </PageLayout>
  );
}
