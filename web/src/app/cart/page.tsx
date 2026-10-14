import type { Metadata } from "next";
import { BagContents } from "./BagContents";

export const metadata: Metadata = { title: "Your bag" };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-5xl sm:text-6xl">Your bag</h1>
      <BagContents />
    </div>
  );
}
