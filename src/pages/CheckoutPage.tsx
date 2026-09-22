import React from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";

/**
 * Minimal checkout page that collects shipping info and "places" an order.
 * In this starter implementation we simulate order creation locally and
 * clear the cart. Full Stripe integration and server-side order creation
 * are expected to be implemented via Supabase Edge Functions in production.
 */
export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    // Minimal local simulation:
    // In production: POST to /api/checkout/intent then confirm via Stripe webhook & create order server-side.
    if (!items.length) {
      alert("Your cart is empty.");
      return;
    }

    // Simulate success
    clear();
    navigate("/order-success");
  };

  return (
    <PageLayout>
      <PageLayout.Content>
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded">
            <h2 className="font-semibold">Shipping Information</h2>
            <p className="text-sm text-muted-foreground">For demo, shipping info is not persisted.</p>
            {/* Minimal form fields */}
            <div className="mt-4 space-y-2">
              <input placeholder="Full name" className="w-full border rounded px-2 py-1" />
              <input placeholder="Address line 1" className="w-full border rounded px-2 py-1" />
              <input placeholder="City" className="w-full border rounded px-2 py-1" />
              <input placeholder="Postal code" className="w-full border rounded px-2 py-1" />
            </div>
          </div>

          <aside className="bg-card p-4 rounded">
            <h2 className="font-semibold">Order Summary</h2>
            <div className="mt-2">
              <div className="flex justify-between"><span>Items</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>—</span></div>
              <div className="flex justify-between font-semibold mt-2"><span>Total</span><span>${subtotal.toFixed(2)}</span></div>
            </div>

            <div className="mt-4">
              <button onClick={handlePlaceOrder} className="w-full btn btn-primary">Place order (Demo)</button>
            </div>
          </aside>
        </div>
      </PageLayout.Content>
    </PageLayout>
  );
}
