import React from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types";
import Image from "react-shimmer"; // Note: This import assumes react-shimmer is available; fallback simple img if not.

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const image = product.images?.[0] ?? "/placeholder.png";
  return (
    <article className="border rounded-md p-3 bg-card">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="h-48 w-full mb-3 overflow-hidden rounded-md flex items-center justify-center bg-muted">
          <img src={image} alt={product.name} className="max-h-full" />
        </div>
        <h3 className="text-sm font-medium">{product.name}</h3>
        <p className="text-xs text-muted-foreground">{product.material ?? ""} • {product.length ?? ""}</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-lg font-semibold">${product.price?.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</div>
        </div>
      </Link>
    </article>
  );
}
