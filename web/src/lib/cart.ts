export type CartLine = {
  key: string;
  productId: number;
  slug: string;
  name: string;
  quantity: number;
  /** Paisa per unit. */
  unitPrice: number;
};

export type Cart = {
  lines: CartLine[];
  count: number;
  /** Paisa. */
  subtotal: number;
};

export const emptyCart: Cart = { lines: [], count: 0, subtotal: 0 };

/** Flat delivery in paisa, free above the threshold. WooCommerce is seeded with the same rule. */
export const SHIPPING_FLAT = 25000;
export const FREE_SHIPPING_FROM = 500000;

export function shippingFor(subtotal: number): number {
  return subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FLAT;
}

export function summarize(lines: CartLine[]): Cart {
  return {
    lines,
    count: lines.reduce((n, l) => n + l.quantity, 0),
    subtotal: lines.reduce((n, l) => n + l.quantity * l.unitPrice, 0),
  };
}

export type CheckoutDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  /** WooCommerce state code for Pakistan, e.g. "IS" or "PB". */
  province: string;
  postcode: string;
  note: string;
};

/** WooCommerce's province codes for Pakistan. */
export const PROVINCES = [
  { code: "IS", name: "Islamabad Capital Territory" },
  { code: "PB", name: "Punjab" },
  { code: "SD", name: "Sindh" },
  { code: "KP", name: "Khyber Pakhtunkhwa" },
  { code: "BA", name: "Balochistan" },
  { code: "GB", name: "Gilgit-Baltistan" },
  { code: "JK", name: "Azad Kashmir" },
];

export const isWooMode = process.env.NEXT_PUBLIC_COMMERCE_MODE === "woocommerce";
