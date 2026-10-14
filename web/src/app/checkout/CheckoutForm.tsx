"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { isWooMode, PROVINCES, shippingFor, type CheckoutDetails } from "@/lib/cart";
import { formatPrice } from "@/lib/money";

type Field = keyof CheckoutDetails;
type Errors = Partial<Record<Field, string>>;

const empty: CheckoutDetails = { firstName: "", lastName: "", email: "", phone: "", address: "", city: "", province: "", postcode: "", note: "" };

const cities = ["Islamabad", "Rawalpindi", "Lahore", "Karachi", "Faisalabad", "Peshawar", "Multan", "Quetta"];

function validate(d: CheckoutDetails): Errors {
  const e: Errors = {};
  if (!d.firstName.trim()) e.firstName = "Enter your first name.";
  if (!d.lastName.trim()) e.lastName = "Enter your last name.";
  if (!/^\S+@\S+\.\S+$/.test(d.email.trim())) e.email = "Enter an email like name@example.com.";
  if (!/^(\+92|0)3\d{2}[-\s]?\d{7}$/.test(d.phone.trim())) e.phone = "Enter a mobile number like 0300-1234567.";
  if (d.address.trim().length < 8) e.address = "Enter your full street address.";
  if (!d.city.trim()) e.city = "Enter your city.";
  if (!d.province) e.province = "Choose your province.";
  if (d.postcode && !/^\d{5}$/.test(d.postcode.trim())) e.postcode = "Postal codes in Pakistan have 5 digits.";
  return e;
}

const labels: Record<Field, string> = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  phone: "Mobile number",
  address: "Street address",
  city: "City",
  province: "Province",
  postcode: "Postal code (optional)",
  note: "Delivery note (optional)",
};

export function CheckoutForm() {
  const { cart, ready, clear } = useCart();
  const router = useRouter();
  const [details, setDetails] = useState<CheckoutDetails>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const set = (field: Field, value: string) => {
    const next = { ...details, [field]: value };
    setDetails(next);
    if (touched[field]) setErrors(validate(next));
  };

  const blur = (field: Field) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(details));
  };

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found = validate(details);
    setErrors(found);
    setTouched(Object.fromEntries(Object.keys(labels).map((k) => [k, true])));
    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setSubmitting(true);
    setServerError(null);
    try {
      let order: string;
      if (isWooMode) {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(details),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message ?? "We couldn't place your order.");
        order = String(data.orderId);
      } else {
        order = `DL-${Math.floor(100000 + Math.random() * 900000)}`;
      }
      clear();
      router.push(`/checkout/success?order=${encodeURIComponent(order)}&name=${encodeURIComponent(details.firstName.trim())}`);
    } catch (e) {
      setServerError((e as Error).message);
      setSubmitting(false);
    }
  }

  if (!ready) return <div className="mt-10 h-64 rounded-3xl bg-cream-deep" aria-hidden="true" />;

  if (cart.lines.length === 0) {
    return (
      <div className="mt-10 rounded-3xl border border-line bg-white p-10 text-center">
        <p className="font-display text-3xl">Your bag is empty</p>
        <p className="mt-2 text-ink-soft">Add something you love, then come back to check out.</p>
        <Link href="/shop" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-cream hover:bg-plum">
          Shop all products
        </Link>
      </div>
    );
  }

  const visibleErrors = (Object.keys(errors) as Field[]).filter((f) => touched[f]);

  const input = (field: Field, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => {
    const error = touched[field] ? errors[field] : undefined;
    return (
      <div className="space-y-1.5">
        <label htmlFor={field} className="block text-sm font-semibold">
          {labels[field]}
        </label>
        <input
          id={field}
          name={field}
          value={details[field]}
          onChange={(e) => set(field, e.target.value)}
          onBlur={() => blur(field)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${field}-error` : undefined}
          className={`block h-12 w-full rounded-xl border bg-white px-4 ${error ? "border-danger" : "border-line focus:border-plum"}`}
          {...props}
        />
        {error && (
          <p id={`${field}-error`} className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={onSubmit} noValidate className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
      <div className="space-y-8">
        {!isWooMode && (
          <p className="rounded-2xl bg-cream-deep px-5 py-4 text-sm">
            <strong>Demo store:</strong> Dewlune is a portfolio project. Placing an order here ships nothing and charges nothing.
          </p>
        )}

        {/* On phones the summary sits after the form, so show the total up front too. */}
        <details className="group rounded-2xl bg-white px-5 py-3 lg:hidden">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 font-semibold">
            <span>
              Order summary{" "}
              <span className="font-normal text-ink-soft">
                ({cart.count} {cart.count === 1 ? "item" : "items"})
              </span>
            </span>
            <span className="flex items-center gap-2 tabular-nums">
              {formatPrice(cart.subtotal + shippingFor(cart.subtotal))}
              <span className="text-xl transition group-open:rotate-45" aria-hidden="true">
                +
              </span>
            </span>
          </summary>
          <div className="pt-3 pb-2">
            <OrderSummary showLines />
          </div>
        </details>

        {visibleErrors.length > 0 && (
          <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-2xl border border-danger bg-white p-5">
            <p className="font-semibold text-danger">Please fix {visibleErrors.length === 1 ? "this field" : `these ${visibleErrors.length} fields`}:</p>
            <ul className="mt-2 list-disc pl-5 text-sm">
              {visibleErrors.map((f) => (
                <li key={f}>
                  <a href={`#${f}`} className="underline">
                    {errors[f]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <fieldset className="space-y-4">
          <legend className="font-display text-3xl">Contact</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            {input("firstName", { autoComplete: "given-name" })}
            {input("lastName", { autoComplete: "family-name" })}
          </div>
          {input("email", { type: "email", autoComplete: "email", inputMode: "email" })}
          {input("phone", { type: "tel", autoComplete: "tel", inputMode: "tel", placeholder: "0300-1234567" })}
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-display text-3xl">Delivery</legend>
          {input("address", { autoComplete: "street-address" })}
          <div className="grid gap-4 sm:grid-cols-2">
            {input("city", { autoComplete: "address-level2", list: "city-list" })}
            <div className="space-y-1.5">
              <label htmlFor="province" className="block text-sm font-semibold">
                {labels.province}
              </label>
              <select
                id="province"
                name="province"
                value={details.province}
                onChange={(e) => set("province", e.target.value)}
                onBlur={() => blur("province")}
                autoComplete="address-level1"
                aria-invalid={touched.province && errors.province ? true : undefined}
                aria-describedby={touched.province && errors.province ? "province-error" : undefined}
                className={`block h-12 w-full rounded-xl border bg-white px-4 ${touched.province && errors.province ? "border-danger" : "border-line focus:border-plum"}`}
              >
                <option value="">Choose…</option>
                {PROVINCES.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
              {touched.province && errors.province && (
                <p id="province-error" className="text-sm text-danger">
                  {errors.province}
                </p>
              )}
            </div>
          </div>
          {input("postcode", { autoComplete: "postal-code", inputMode: "numeric" })}
          <datalist id="city-list">
            {cities.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <div className="space-y-1.5">
            <label htmlFor="note" className="block text-sm font-semibold">
              {labels.note}
            </label>
            <textarea
              id="note"
              name="note"
              rows={3}
              value={details.note}
              onChange={(e) => set("note", e.target.value)}
              className="block w-full rounded-xl border border-line bg-white px-4 py-3 focus:border-plum"
            />
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="font-display text-3xl">Payment</legend>
          <label className="flex items-center gap-3 rounded-xl border border-plum bg-white px-4 py-4">
            <input type="radio" name="payment" value="cod" defaultChecked className="h-5 w-5 accent-plum" />
            <span>
              <span className="block font-semibold">Cash on delivery</span>
              <span className="block text-sm text-ink-soft">Pay the rider when your order arrives.</span>
            </span>
          </label>
        </fieldset>
      </div>

      <aside aria-label="Order summary" className="space-y-5 self-start rounded-3xl bg-white p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-3xl">Order summary</h2>
        <OrderSummary showLines />
        {serverError && (
          <p className="text-sm text-danger" role="alert">
            {serverError}
          </p>
        )}
        <button type="submit" disabled={submitting} className="w-full rounded-full bg-ink py-4 font-semibold text-cream hover:bg-plum disabled:opacity-60">
          {submitting ? "Placing order…" : "Place order"}
        </button>
      </aside>
    </form>
  );
}
