"use client";

import Link from "next/link";
import { CartLines } from "@/components/cart/CartLines";
import { useCart } from "@/components/cart/CartProvider";
import { FreeShippingMeter } from "@/components/cart/FreeShippingMeter";
import { OrderSummary } from "@/components/cart/OrderSummary";

export function BagContents() {
  const { cart, ready, error } = useCart();

  if (!ready) {
    return <div className="mt-10 h-40 rounded-3xl bg-cream-deep" aria-hidden="true" />;
  }

  if (cart.lines.length === 0) {
    return (
      <div className="mt-10 rounded-3xl border border-line bg-white p-10 text-center">
        <p className="font-display text-3xl">Your bag is empty</p>
        <Link href="/shop" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-cream hover:bg-plum">
          Shop all products
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
      <div>
        <CartLines />
      </div>
      <aside aria-label="Order summary" className="space-y-5 self-start rounded-3xl bg-white p-6 lg:sticky lg:top-24">
        <FreeShippingMeter subtotal={cart.subtotal} />
        <OrderSummary />
        {error && (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        )}
        <Link href="/checkout" className="block rounded-full bg-ink py-4 text-center font-semibold text-cream hover:bg-plum">
          Checkout
        </Link>
      </aside>
    </div>
  );
}
