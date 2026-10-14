import type { CheckoutDetails } from "@/lib/cart";
import { storeUrl } from "@/lib/catalog/woo";
import { placeStoreOrder, StoreError } from "@/lib/woo-cart";

export async function POST(request: Request) {
  if (!storeUrl()) {
    return Response.json({ message: "WooCommerce is not configured" }, { status: 404 });
  }
  const details = (await request.json()) as CheckoutDetails;
  try {
    return Response.json(await placeStoreOrder(details));
  } catch (err) {
    const status = err instanceof StoreError ? err.status : 502;
    const message = err instanceof Error ? err.message : "Checkout failed";
    return Response.json({ message }, { status });
  }
}
