import Link from "next/link";
import { FREE_SHIPPING_FROM } from "@/lib/cart";
import { formatPrice } from "@/lib/money";

export function AnnouncementBar() {
  return (
    <div className="on-dark bg-plum-deep text-cream">
      <p className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-2 px-4 py-2 text-center text-xs font-medium sm:text-sm">
        <span>Free delivery over {formatPrice(FREE_SHIPPING_FROM)}</span>
        <span aria-hidden="true" className="text-moon">
          ·
        </span>
        <span>Cash on delivery across Pakistan</span>
        <span aria-hidden="true" className="hidden text-moon sm:inline">
          ·
        </span>
        <Link href="/delivery" className="hidden underline underline-offset-4 hover:text-moon sm:inline">
          Delivery details
        </Link>
      </p>
    </div>
  );
}
