/** Public origin of the store, used for absolute URLs in metadata, the sitemap and structured data. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
