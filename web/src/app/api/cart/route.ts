import { storeUrl } from "@/lib/catalog/woo";
import { addStoreItem, getStoreCart, removeStoreItem, StoreError, updateStoreItem } from "@/lib/woo-cart";

async function handle(work: () => Promise<unknown>) {
  if (!storeUrl()) {
    return Response.json({ message: "WooCommerce is not configured" }, { status: 404 });
  }
  try {
    return Response.json(await work());
  } catch (err) {
    const status = err instanceof StoreError ? err.status : 502;
    const message = err instanceof Error ? err.message : "Cart request failed";
    return Response.json({ message }, { status });
  }
}

export function GET() {
  return handle(getStoreCart);
}

/** Add a product: { id, quantity } */
export async function POST(request: Request) {
  const { id, quantity } = (await request.json()) as { id: number; quantity: number };
  return handle(() => addStoreItem(Number(id), Math.max(1, Number(quantity) || 1)));
}

/** Change a line's quantity: { key, quantity } */
export async function PATCH(request: Request) {
  const { key, quantity } = (await request.json()) as { key: string; quantity: number };
  return handle(() => updateStoreItem(String(key), Math.max(1, Number(quantity) || 1)));
}

/** Remove a line: ?key= */
export async function DELETE(request: Request) {
  const key = new URL(request.url).searchParams.get("key") ?? "";
  return handle(() => removeStoreItem(key));
}
