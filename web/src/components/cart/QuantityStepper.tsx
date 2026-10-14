"use client";

type Props = {
  value: number;
  onChange: (value: number) => void;
  label: string;
  disabled?: boolean;
  size?: "sm" | "md";
};

export function QuantityStepper({ value, onChange, label, disabled, size = "md" }: Props) {
  const box = size === "sm" ? "h-10 w-10" : "h-12 w-12";
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-white" role="group" aria-label={label}>
      <button
        type="button"
        className={`${box} grid place-items-center rounded-full text-lg disabled:opacity-40`}
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= 1}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="min-w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={`${box} grid place-items-center rounded-full text-lg disabled:opacity-40`}
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= 10}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
