import React from "react";
import { useParams } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { useProducts } from "@/hooks/useProducts";
import ProductGrid from "@/components/store/ProductGrid";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useProducts({ category: slug, limit: 24 });

  return (
    <PageLayout>
      <PageLayout.Content>
        <div className="my-6">
          <h1 className="text-2xl font-bold capitalize">{slug}</h1>
          <p className="text-muted-foreground">Browse {slug} instruments</p>
        </div>

        {isLoading ? (
          <div>Loading products...</div>
        ) : isError ? (
          <div className="text-destructive">Failed to load products.</div>
        ) : data?.products?.length ? (
          <ProductGrid products={data.products} />
        ) : (
          <div className="p-6 bg-card rounded">No products found for this category.</div>
        )}
      </PageLayout.Content>
    </PageLayout>
  );
}
