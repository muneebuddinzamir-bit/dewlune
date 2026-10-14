import { FREE_SHIPPING_FROM } from "@/lib/cart";
import { formatPrice } from "@/lib/money";

export function FreeShippingMeter({ subtotal }: { subtotal: number }) {
  const progress = Math.min(1, subtotal / FREE_SHIPPING_FROM);
  const remaining = FREE_SHIPPING_FROM - subtotal;
  return (
    <div className="space-y-2">
      <p className="text-sm">
        {remaining > 0 ? (
          <>
            You&apos;re <strong>{formatPrice(remaining)}</strong> away from free delivery.
          </>
        ) : (
          <strong>You&apos;ve unlocked free delivery.</strong>
        )}
      </p>
      <div
        className="h-2 overflow-hidden rounded-full bg-cream-deep"
        role="progressbar"
        aria-label="Progress to free delivery"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <div className="h-full rounded-full bg-sage transition-[width] duration-500" style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  );
}
