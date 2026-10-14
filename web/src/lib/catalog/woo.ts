import { artFor, demoConcerns } from "./demo";
import type { Concern, Product } from "./types";

/** Shapes of the WooCommerce Store API responses this app reads. */
type StorePrices = {
  price: string;
  regular_price: string;
  currency_minor_unit: number;
};

type StoreProduct = {
  id: number;
  slug: string;
  name: string;
  short_description: string;
  description: string;
  prices: StorePrices;
  images: { src: string; alt: string }[];
  categories: { slug: string }[];
  attributes: { name: string; terms: { name: string }[] }[];
  is_in_stock: boolean;
};

type StoreCategory = { slug: string; name: string; description: string; count: number };

export function storeUrl(): string | undefined {
  return process.env.WC_STORE_URL?.replace(/\/$/, "");
}

async function storeGet<T>(path: string): Promise<T> {
  const res = await fetch(`${storeUrl()}/wp-json/wc/store/v1${path}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`WooCommerce Store API ${path} returned ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/** Converts a Store API price string to paisa, whatever decimal setting the store uses. */
export function toPaisa(value: string, minorUnit: number): number {
  return Math.round(Number(value) * 10 ** (2 - minorUnit));
}

export function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function attribute(product: StoreProduct, name: string): string[] {
  const found = product.attributes.find((a) => a.name.toLowerCase() === name.toLowerCase());
  return found ? found.terms.map((t) => t.name) : [];
}

function toProduct(p: StoreProduct): Product {
  const image = p.images[0];
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: stripHtml(p.short_description),
    price: toPaisa(p.prices.price, p.prices.currency_minor_unit),
    regularPrice: toPaisa(p.prices.regular_price, p.prices.currency_minor_unit),
    size: attribute(p, "Size")[0] ?? "",
    concerns: p.categories.map((c) => c.slug),
    description: stripHtml(p.description),
    keyIngredients: attribute(p, "Key ingredients"),
    howToUse: attribute(p, "How to use")[0] ?? "",
    inStock: p.is_in_stock,
    image: image ? { src: image.src, alt: image.alt || p.name } : null,
    art: artFor(p.slug),
  };
}

function rank(slug: string): number {
  const i = demoConcerns.findIndex((c) => c.slug === slug);
  return i === -1 ? demoConcerns.length : i;
}

export async function fetchWooCatalog(): Promise<{ products: Product[]; concerns: Concern[] }> {
  const [products, categories] = await Promise.all([
    storeGet<StoreProduct[]>("/products?per_page=50&orderby=menu_order&order=asc"),
    storeGet<StoreCategory[]>("/products/categories?per_page=50"),
  ]);
  const concerns = categories
    .filter((c) => c.count > 0 && c.slug !== "uncategorized")
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      blurb:
        stripHtml(c.description) ||
        demoConcerns.find((d) => d.slug === c.slug)?.blurb ||
        "",
    }))
    // WooCommerce lists categories alphabetically; keep the brand's own order where we know it.
    .sort((a, b) => rank(a.slug) - rank(b.slug));
  return { products: products.map(toProduct), concerns };
}
