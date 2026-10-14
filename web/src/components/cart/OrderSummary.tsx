"use client";

import { shippingFor } from "@/lib/cart";
import { formatPrice } from "@/lib/money";
import { useCart } from "./CartProvider";

export function OrderSummary({ showLines = false }: { showLines?: boolean }) {
  const { cart } = useCart();
  const shipping = shippingFor(cart.subtotal);

  return (
    <div className="space-y-3">
      {showLines && (
        <ul className="space-y-2 border-b border-line pb-4 text-sm">
          {cart.lines.map((l) => (
            <li key={l.key} className="flex justify-between gap-3">
              <span>
                {l.name} <span className="text-ink-soft">× {l.quantity}</span>
              </span>
              <span className="tabular-nums">{formatPrice(l.unitPrice * l.quantity)}</span>
            </li>
          ))}
        </ul>
      )}
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd className="tabular-nums">{formatPrice(cart.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Delivery</dt>
          <dd className="tabular-nums">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatPrice(cart.subtotal + shipping)}</dd>
        </div>
      </dl>
    </div>
  );
}
