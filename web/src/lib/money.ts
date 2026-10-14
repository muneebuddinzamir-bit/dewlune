const formatter = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 });

/** Formats a price held in paisa as "Rs 2,450". */
export function formatPrice(minor: number): string {
  return `Rs ${formatter.format(Math.round(minor / 100))}`;
}
