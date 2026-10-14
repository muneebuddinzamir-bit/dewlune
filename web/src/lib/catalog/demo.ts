import data from "@/data/catalog.json";
import type { Concern, Product, ProductArtSpec } from "./types";

type CatalogEntry = (typeof data.products)[number];

export const demoConcerns: Concern[] = data.concerns;

export const demoProducts: Product[] = data.products.map((entry: CatalogEntry, index) => ({
  ...entry,
  id: index + 1,
  inStock: true,
  image: null,
  art: entry.art as ProductArtSpec,
}));

/** Look up the drawing for a product by slug, so WooCommerce products without photos still have art. */
export function artFor(slug: string): ProductArtSpec {
  return (
    demoProducts.find((p) => p.slug === slug)?.art ?? {
      shape: "bottle",
      body: "#efe6da",
      accent: "#3b2a6b",
      label: "DEWLUNE",
    }
  );
}
