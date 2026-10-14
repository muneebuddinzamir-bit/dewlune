import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { isWooMode } from "@/lib/cart";

export const metadata: Metadata = { title: "Order placed" };

async function Confirmation({ searchParams }: Pick<PageProps<"/checkout/success">, "searchParams">) {
  const params = await searchParams;
  const order = typeof params.order === "string" ? params.order : undefined;
  const name = typeof params.name === "string" ? params.name : undefined;

  return (
    <>
      <h1 className="mt-6 font-display text-5xl sm:text-6xl">Thank you{name ? `, ${name}` : ""}!</h1>
      {order ? (
        <p className="mt-4 text-lg">
          Your order number is <strong className="tabular-nums">{isWooMode ? `#${order}` : order}</strong>.
        </p>
      ) : (
        <p className="mt-4 text-lg">Your order has been placed.</p>
      )}
    </>
  );
}

export default function SuccessPage(props: PageProps<"/checkout/success">) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sage text-3xl text-cream" aria-hidden="true">
        ✓
      </div>
      <Suspense fallback={<h1 className="mt-6 font-display text-5xl">Thank you!</h1>}>
        <Confirmation searchParams={props.searchParams} />
      </Suspense>
      <p className="mt-3 text-ink-soft">
        {isWooMode
          ? "The order was created in WooCommerce and will show up in the store's admin."
          : "This is a demo store, so nothing will be shipped and nothing was charged."}
      </p>
      <Link href="/shop" className="mt-10 inline-block rounded-full bg-ink px-7 py-3.5 font-semibold text-cream hover:bg-plum">
        Keep shopping
      </Link>
    </div>
  );
}
