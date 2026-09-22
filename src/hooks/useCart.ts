import { useState, useEffect, useMemo } from "react";
import { Product } from "@/types";

type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant_attributes?: Record<string, any>;
};

const STORAGE_KEY = "norralco_cart_v1";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const add = (product: { id: string; name: string; price: number; image?: string }, qty = 1, variant_attributes?: any) => {
    setItems((current) => {
      const found = current.find(i => i.productId === product.id && JSON.stringify(i.variant_attributes || {}) === JSON.stringify(variant_attributes || {}));
      if (found) {
        return current.map(i => i === found ? { ...i, quantity: i.quantity + qty } : i);
      }
      const item: CartItem = {
        id: `${product.id}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: qty,
        image: product.image,
        variant_attributes,
      };
      return [...current, item];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems(current => current.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const remove = (id: string) => {
    setItems(current => current.filter(i => i.id !== id));
  };

  const clear = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);

  return { items, add, updateQuantity, remove, clear, subtotal };
}
