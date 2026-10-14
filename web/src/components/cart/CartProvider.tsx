"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { emptyCart, isWooMode, summarize, type Cart } from "@/lib/cart";
import type { Product } from "@/lib/catalog/types";

export type CatalogItem = Pick<Product, "id" | "slug" | "name" | "price" | "size" | "image" | "art">;

type CartContextValue = {
  cart: Cart;
  ready: boolean;
  busy: boolean;
  error: string | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (product: CatalogItem, quantity?: number) => Promise<void>;
  update: (key: string, quantity: number) => Promise<void>;
  remove: (key: string) => Promise<void>;
  clear: () => void;
  itemFor: (slug: string) => CatalogItem | undefined;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "dewlune-cart";
type StoredLine = { productId: number; quantity: number };

function readStored(): StoredLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as StoredLine[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * The demo cart lives in localStorage. A tiny external store lets React read it
 * with useSyncExternalStore, and keeps other open tabs in step via the storage event.
 */
const NO_LINES: StoredLine[] = [];
const listeners = new Set<() => void>();
let snapshot: StoredLine[] | null = null;

const demoStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        snapshot = readStored();
        listener();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },
  get: () => (snapshot ??= readStored()),
  getServer: () => NO_LINES,
  set(lines: StoredLine[]) {
    snapshot = lines;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Private mode or storage disabled: the cart still works for this visit.
    }
    listeners.forEach((l) => l());
  },
};

const noop = () => () => {};
/** False during the server render and hydration, true once running in the browser. */
const useHydrated = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

async function api(method: string, path: string, body?: unknown): Promise<Cart> {
  const res = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Something went wrong with your bag");
  return data as Cart;
}

export function CartProvider({ catalog, children }: { catalog: CatalogItem[]; children: React.ReactNode }) {
  const stored = useSyncExternalStore(demoStore.subscribe, demoStore.get, demoStore.getServer);
  const hydrated = useHydrated();
  const [wooCart, setWooCart] = useState<Cart>(emptyCart);
  const [wooReady, setWooReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const byId = useMemo(() => new Map(catalog.map((p) => [p.id, p])), [catalog]);
  const bySlug = useMemo(() => new Map(catalog.map((p) => [p.slug, p])), [catalog]);

  useEffect(() => {
    if (!isWooMode) return;
    api("GET", "/api/cart")
      .then(setWooCart)
      .catch((e: Error) => setError(e.message))
      .finally(() => setWooReady(true));
  }, []);

  const demoCart = useMemo(
    () =>
      summarize(
        stored.flatMap((line) => {
          const p = byId.get(line.productId);
          return p
            ? [{ key: String(p.id), productId: p.id, slug: p.slug, name: p.name, quantity: line.quantity, unitPrice: p.price }]
            : [];
        }),
      ),
    [stored, byId],
  );

  const saveDemo = useCallback((next: StoredLine[]) => demoStore.set(next), []);

  const run = useCallback(async (work: () => Promise<Cart>) => {
    setBusy(true);
    setError(null);
    try {
      setWooCart(await work());
    } catch (e) {
      setError((e as Error).message);
      throw e;
    } finally {
      setBusy(false);
    }
  }, []);

  const add = useCallback(
    async (product: CatalogItem, quantity = 1) => {
      if (isWooMode) {
        await run(() => api("POST", "/api/cart", { id: product.id, quantity }));
      } else {
        const current = demoStore.get();
        const existing = current.find((l) => l.productId === product.id);
        saveDemo(
          existing
            ? current.map((l) => (l.productId === product.id ? { ...l, quantity: Math.min(10, l.quantity + quantity) } : l))
            : [...current, { productId: product.id, quantity }],
        );
      }
      setOpen(true);
    },
    [run, saveDemo],
  );

  const update = useCallback(
    async (key: string, quantity: number) => {
      const qty = Math.max(1, Math.min(10, quantity));
      if (isWooMode) {
        await run(() => api("PATCH", "/api/cart", { key, quantity: qty }));
      } else {
        saveDemo(demoStore.get().map((l) => (String(l.productId) === key ? { ...l, quantity: qty } : l)));
      }
    },
    [run, saveDemo],
  );

  const remove = useCallback(
    async (key: string) => {
      if (isWooMode) {
        await run(() => api("DELETE", `/api/cart?key=${encodeURIComponent(key)}`));
      } else {
        saveDemo(demoStore.get().filter((l) => String(l.productId) !== key));
      }
    },
    [run, saveDemo],
  );

  // WooCommerce empties its own cart when an order is placed; we only reset our copy.
  const clear = useCallback(() => {
    if (isWooMode) setWooCart(emptyCart);
    else saveDemo([]);
  }, [saveDemo]);

  const value: CartContextValue = {
    cart: isWooMode ? wooCart : demoCart,
    ready: isWooMode ? wooReady : hydrated,
    busy,
    error,
    open,
    setOpen,
    add,
    update,
    remove,
    clear,
    itemFor: (slug) => bySlug.get(slug),
  };

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
