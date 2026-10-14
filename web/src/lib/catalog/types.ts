export type Concern = {
  slug: string;
  name: string;
  blurb: string;
};

export type BottleShape = "dropper" | "pump" | "tube" | "jar" | "bottle";

/** How the product is drawn when the store has no photo for it. */
export type ProductArtSpec = {
  shape: BottleShape;
  body: string;
  accent: string;
  label: string;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  /** Price in paisa (minor units), so Rs 2,450 is 245000. */
  price: number;
  regularPrice: number;
  size: string;
  concerns: string[];
  description: string;
  keyIngredients: string[];
  howToUse: string;
  inStock: boolean;
  image: { src: string; alt: string } | null;
  art: ProductArtSpec;
};
