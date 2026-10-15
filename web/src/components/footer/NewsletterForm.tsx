"use client";

import { useId, useState } from "react";

/** Demo sign-up: validates the address and confirms, but stores nothing. */
export function NewsletterForm() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Enter an email like name@example.com.");
      return;
    }
    setError(null);
    setDone(true);
  }

  if (done) {
    return (
      <p className="mt-6 rounded-2xl bg-cream/10 px-5 py-4" role="status">
        <strong>Thanks, you&apos;re on the list.</strong> <span className="text-cream/75">(Demo store: no email was stored.)</span>
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-6">
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={id}
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="h-12 w-full min-w-0 rounded-full sm:flex-1 border border-cream/30 bg-cream/10 px-5 text-cream placeholder:text-cream/50 focus:border-moon"
        />
        <button type="submit" className="h-12 rounded-full bg-cream px-6 font-semibold text-ink transition hover:bg-moon">
          Subscribe
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-dusk">
          {error}
        </p>
      )}
    </form>
  );
}
