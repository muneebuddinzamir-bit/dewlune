import Image from "next/image";
import type { Product } from "@/lib/catalog/types";
import { ProductArt } from "./ProductArt";

type Props = {
  product: Pick<Product, "slug" | "name" | "image" | "art">;
  variant: string;
  className?: string;
  sizes?: string;
  preload?: boolean;
};

/** The product photo from the store when there is one, otherwise its drawn bottle. */
export function ProductImage({ product, variant, className, sizes = "(min-width: 1024px) 25vw, 50vw", preload }: Props) {
  if (product.image) {
    return (
      <Image
        src={product.image.src}
        alt={product.image.alt}
        width={800}
        height={1000}
        sizes={sizes}
        preload={preload}
        unoptimized
        className={`object-cover ${className ?? ""}`}
      />
    );
  }
  return <ProductArt art={product.art} uid={`${product.slug}-${variant}`} title={product.name} className={className} />;
}
