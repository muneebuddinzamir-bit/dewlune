import { cookies } from "next/headers";
import { summarize, type Cart, type CheckoutDetails } from "./cart";
import { storeUrl, toPaisa } from "./catalog/woo";

/**
 * Server-side bridge to the WooCommerce Store API cart. The Store API identifies a
 * guest cart with a Cart-Token header; we keep that token in an httpOnly cookie so
 * the browser never talks to WordPress directly.
 */

const TOKEN_COOKIE = "dl_cart_token";

type StoreCartItem = {
  key: string;
  id: number;
  name: string;
  quantity: number;
  permalink: string;
  prices: { price: string; currency_minor_unit: number };
};

type StoreCart = { items: StoreCartItem[] };

export class StoreError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

function slugFromPermalink(permalink: string): string {
  return permalink.replace(/\/$/, "").split("/").pop() ?? "";
}

export function toCart(store: StoreCart): Cart {
  return summarize(
    store.items.map((item) => ({
      key: item.key,
      productId: item.id,
      slug: slugFromPermalink(item.permalink),
      name: item.name,
      quantity: item.quantity,
      unitPrice: toPaisa(item.prices.price, item.prices.currency_minor_unit),
    })),
  );
}

type Init = { method?: string; body?: unknown };

async function rawFetch(path: string, init: Init, token: string | undefined) {
  const res = await fetch(`${storeUrl()}/wp-json/wc/store/v1${path}`, {
    method: init.method ?? "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { "Cart-Token": token } : {}),
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  const data: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new StoreError((data as { message?: string }).message ?? `Store API ${path} failed`, res.status);
  }
  return { data, token: res.headers.get("Cart-Token") ?? token };
}

async function storeFetch<T>(path: string, init: Init = {}): Promise<T> {
  const jar = await cookies();
  const saved = jar.get(TOKEN_COOKIE)?.value;
  let token = saved;

  // A write needs a Cart-Token; the first GET of a new guest cart hands one out.
  if (!token && init.method === "POST") {
    token = (await rawFetch("/cart", {}, undefined)).token;
  }

  const result = await rawFetch(path, init, token);
  if (result.token && result.token !== saved) {
    jar.set(TOKEN_COOKIE, result.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 48,
    });
  }
  return result.data as T;
}

export const getStoreCart = async () => toCart(await storeFetch<StoreCart>("/cart"));

export const addStoreItem = async (id: number, quantity: number) =>
  toCart(await storeFetch<StoreCart>("/cart/add-item", { method: "POST", body: { id, quantity } }));

export const updateStoreItem = async (key: string, quantity: number) =>
  toCart(await storeFetch<StoreCart>("/cart/update-item", { method: "POST", body: { key, quantity } }));

export const removeStoreItem = async (key: string) =>
  toCart(await storeFetch<StoreCart>("/cart/remove-item", { method: "POST", body: { key } }));

export async function placeStoreOrder(details: CheckoutDetails): Promise<{ orderId: number }> {
  const address = {
    first_name: details.firstName,
    last_name: details.lastName,
    address_1: details.address,
    city: details.city,
    postcode: details.postcode,
    country: "PK",
    state: details.province,
    phone: details.phone,
  };
  const order = await storeFetch<{ order_id: number }>("/checkout", {
    method: "POST",
    body: {
      billing_address: { ...address, email: details.email },
      shipping_address: address,
      payment_method: "cod",
      customer_note: details.note,
    },
  });
  return { orderId: order.order_id };
}
