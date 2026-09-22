import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useProduct } from "@/hooks/useProducts";
import { PageLayout } from "@/components/layout/PageLayout";
import { useCart } from "@/hooks/useCart";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useProduct(slug ?? "");
  const cart = useCart();
  const [qty, setQty] = useState(1);

  if (isLoading) {
    return <PageLayout><PageLayout.Content>Loading product...</PageLayout.Content></PageLayout>;
  }

  if (isError || !product) {
    return <PageLayout><PageLayout.Content className="p-6">Product not found.</PageLayout.Content></PageLayout>;
  }

  const image = product.images?.[0] ?? "/placeholder.png";

  const addToCart = () => {
    cart.add({ id: product.id, name: product.name, price: Number(product.price), image }, qty);
  };

  return (
    <PageLayout>
      <PageLayout.Content>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-muted rounded p-4">
              <img src={image} alt={product.name} className="w-full h-96 object-contain" />
            </div>
            <div className="mt-4">
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="text-muted-foreground mt-2">{product.description}</p>
            </div>
          </div>

          <aside className="bg-card p-4 rounded">
            <div className="text-2xl font-semibold">${Number(product.price).toFixed(2)}</div>
            <div className="text-sm text-muted-foreground mt-1">{product.stock > 0 ? `${product.stock} available` : "Out of stock"}</div>

            <div className="mt-4">
              <label className="block text-sm">Quantity</label>
              <input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} className="w-20 border rounded px-2 py-1 mt-1" />
            </div>

            <button disabled={product.stock <= 0} onClick={addToCart} className="w-full mt-4 btn btn-primary">
              Add to cart
            </button>
          </aside>
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Specifications</h2>
          <dl className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div><dt className="font-medium">Material</dt><dd>{product.material ?? "—"}</dd></div>
            <div><dt className="font-medium">Shape</dt><dd>{product.shape ?? "—"}</dd></div>
            <div><dt className="font-medium">Length</dt><dd>{product.length ?? "—"}</dd></div>
            <div><dt className="font-medium">Tip Size</dt><dd>{product.tip_size ?? "—"}</dd></div>
          </dl>
        </section>
      </PageLayout.Content>
    </PageLayout>
  );
}
