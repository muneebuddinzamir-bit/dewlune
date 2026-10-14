import { cacheLife, cacheTag } from "next/cache";
import { demoConcerns, demoProducts } from "./demo";
import type { Concern, Product } from "./types";
import { fetchWooCatalog, storeUrl } from "./woo";

export type { Concern, Product } from "./types";

/** The whole catalog: from WooCommerce when WC_STORE_URL is set, otherwise the bundled demo data. */
export async function getCatalog(): Promise<{ products: Product[]; concerns: Concern[] }> {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");
  if (storeUrl()) {
    return fetchWooCatalog();
  }
  return { products: demoProducts, concerns: demoConcerns };
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const { products } = await getCatalog();
  return products.find((p) => p.slug === slug);
}
