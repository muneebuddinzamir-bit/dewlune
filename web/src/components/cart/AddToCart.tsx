"use client";

import { useState } from "react";
import { useCart, type CatalogItem } from "./CartProvider";
import { QuantityStepper } from "./QuantityStepper";

export function AddToCart({ product, inStock }: { product: CatalogItem; inStock: boolean }) {
  const { add, busy, error } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  async function onAdd() {
    setAdding(true);
    try {
      await add(product, quantity);
      setQuantity(1);
    } catch {
      // The provider keeps the message; it is shown below.
    } finally {
      setAdding(false);
    }
  }

  if (!inStock) {
    return <p className="rounded-full bg-cream-deep px-6 py-4 text-center font-semibold text-ink-soft">Out of stock</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper value={quantity} onChange={(v) => setQuantity(Math.max(1, Math.min(10, v)))} label="Quantity" />
        <button
          type="button"
          onClick={onAdd}
          disabled={adding || busy}
          className="h-12 flex-1 rounded-full bg-ink px-8 font-semibold text-cream transition hover:bg-plum disabled:opacity-60"
        >
          {adding ? "Adding…" : "Add to bag"}
        </button>
      </div>
      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** A compact add button for product cards. */
export function QuickAdd({ product }: { product: CatalogItem }) {
  const { add, busy } = useCart();
  return (
    <button
      type="button"
      onClick={() => add(product, 1).catch(() => undefined)}
      disabled={busy}
      className="min-h-11 rounded-full border border-ink px-4 text-sm font-semibold transition hover:bg-ink hover:text-cream disabled:opacity-60"
      aria-label={`Add ${product.name} to bag`}
    >
      Add
    </button>
  );
}
