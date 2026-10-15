import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider, type CatalogItem } from "@/components/cart/CartProvider";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { SiteFooter } from "@/components/footer/SiteFooter";
import { Header } from "@/components/Header";
import { getCatalog } from "@/lib/catalog";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dewlune | Gentle skincare for every season",
    template: "%s | Dewlune",
  },
  description: "Serums, cleansers and sunscreen made for Pakistani weather. A portfolio storefront built with Next.js, Plasma UI and WooCommerce.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { products } = await getCatalog();
  const catalog: CatalogItem[] = products.map(({ id, slug, name, price, size, image, art }) => ({
    id,
    slug,
    name,
    price,
    size,
    image,
    art,
  }));

  return (
    <html lang="en" className={`${manrope.variable} ${instrument.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-ink px-5 py-3 font-semibold text-cream focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <CartProvider catalog={catalog}>
          <AnnouncementBar />
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
