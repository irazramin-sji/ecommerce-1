import React from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useCart } from "@/hooks/useCart";
import { Link, useNavigate } from "react-router-dom";

export default function CartPage() {
  const { items, updateQuantity, remove, subtotal } = useCart();
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <PageLayout>
        <PageLayout.Content>
          <div className="p-8 bg-card rounded text-center">
            <h2 className="text-xl font-semibold">Your cart is empty</h2>
            <p className="mt-2 text-muted-foreground">Browse products and add them to your cart.</p>
            <div className="mt-4">
              <Link to="/" className="btn btn-primary">Continue shopping</Link>
            </div>
          </div>
        </PageLayout.Content>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageLayout.Content>
        <h1 className="text-2xl font-bold mb-4">Cart</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ul className="space-y-4">
              {items.map(item => (
                <li key={item.id} className="flex items-center gap-4 border rounded p-3">
                  <img src={item.image ?? "/placeholder.png"} alt={item.name} className="w-20 h-20 object-contain" />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">${item.price.toFixed(2)}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <input type="number" min={1} value={item.quantity} onChange={(e) => updateQuantity(item.id, Number(e.target.value))} className="w-20 border rounded px-2 py-1" />
                      <button onClick={() => remove(item.id)} className="text-sm text-destructive">Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <aside className="bg-card p-4 rounded">
            <div className="text-sm">Subtotal</div>
            <div className="text-2xl font-semibold">${subtotal.toFixed(2)}</div>
            <button onClick={() => navigate("/checkout")} className="w-full mt-4 btn btn-primary">Proceed to checkout</button>
          </aside>
        </div>
      </PageLayout.Content>
    </PageLayout>
  );
}
