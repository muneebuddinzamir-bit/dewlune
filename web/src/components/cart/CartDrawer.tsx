"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { formatPrice } from "@/lib/money";
import { CartLines } from "./CartLines";
import { useCart } from "./CartProvider";
import { FreeShippingMeter } from "./FreeShippingMeter";

export function CartDrawer() {
  const { cart, open, setOpen, error } = useCart();
  const ref = useRef<HTMLDialogElement>(null);

  // The native dialog gives us the focus trap, Escape to close and inert page content.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const close = () => setOpen(false);

  return (
    <dialog
      ref={ref}
      onClose={close}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      aria-labelledby="cart-title"
      className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-dvh w-full max-w-md bg-cream p-0 text-ink shadow-2xl backdrop:bg-plum-deep/50 backdrop:backdrop-blur-sm"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 id="cart-title" className="font-display text-3xl">
            Your bag <span className="text-lg text-ink-soft">({cart.count})</span>
          </h2>
          <button
            type="button"
            onClick={close}
            className="grid h-11 w-11 place-items-center rounded-full text-2xl hover:bg-cream-deep"
            aria-label="Close bag"
            autoFocus
          >
            ×
          </button>
        </div>

        {cart.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="font-display text-3xl">Your bag is empty</p>
            <p className="text-ink-soft">Start with a bestseller, or shop by what your skin needs.</p>
            <Link href="/shop" onClick={close} className="rounded-full bg-ink px-6 py-3 font-semibold text-cream hover:bg-plum">
              Shop all products
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-line px-6 py-4">
              <FreeShippingMeter subtotal={cart.subtotal} />
            </div>
            <div className="flex-1 overflow-y-auto px-6">
              <CartLines onNavigate={close} />
            </div>
            <div className="space-y-3 border-t border-line px-6 py-5">
              {error && (
                <p className="text-sm text-danger" role="alert">
                  {error}
                </p>
              )}
              <div className="flex items-center justify-between text-lg">
                <span>Subtotal</span>
                <span className="font-semibold tabular-nums">{formatPrice(cart.subtotal)}</span>
              </div>
              <p className="text-sm text-ink-soft">Delivery is calculated at checkout. Cash on delivery available.</p>
              <Link
                href="/checkout"
                onClick={close}
                className="block rounded-full bg-ink py-4 text-center font-semibold text-cream hover:bg-plum"
              >
                Checkout
              </Link>
              <Link href="/cart" onClick={close} className="block py-2 text-center text-sm font-semibold underline underline-offset-4">
                View bag
              </Link>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
