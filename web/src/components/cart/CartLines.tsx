"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/money";
import { ProductArt } from "../ProductArt";
import { useCart } from "./CartProvider";
import { QuantityStepper } from "./QuantityStepper";

/** The list of lines in the bag, shared by the drawer and the bag page. */
export function CartLines({ onNavigate }: { onNavigate?: () => void }) {
  const { cart, update, remove, busy, itemFor } = useCart();

  return (
    <ul className="divide-y divide-line">
      {cart.lines.map((line) => {
        const item = itemFor(line.slug);
        return (
          <li key={line.key} className="flex gap-4 py-5">
            <Link
              href={`/products/${line.slug}`}
              onClick={onNavigate}
              className="block h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-cream-deep"
              tabIndex={-1}
              aria-hidden="true"
            >
              {item?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image.src} alt="" className="h-full w-full object-cover" />
              ) : item ? (
                <ProductArt art={item.art} uid={`${line.slug}-line`} className="h-full w-full" />
              ) : null}
            </Link>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/products/${line.slug}`} onClick={onNavigate} className="font-semibold hover:underline">
                    {line.name}
                  </Link>
                  {item?.size && <p className="text-sm text-ink-soft">{item.size}</p>}
                </div>
                <p className="shrink-0 font-semibold tabular-nums">{formatPrice(line.unitPrice * line.quantity)}</p>
              </div>
              <div className="flex items-center justify-between gap-3">
                <QuantityStepper
                  size="sm"
                  value={line.quantity}
                  disabled={busy}
                  label={`Quantity of ${line.name}`}
                  onChange={(q) => update(line.key, q).catch(() => undefined)}
                />
                <button
                  type="button"
                  onClick={() => remove(line.key).catch(() => undefined)}
                  disabled={busy}
                  className="min-h-11 px-2 text-sm text-ink-soft underline underline-offset-4 hover:text-ink disabled:opacity-50"
                >
                  Remove<span className="sr-only"> {line.name}</span>
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
