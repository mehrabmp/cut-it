import { clsx, type ClassValue } from "clsx";
import { customAlphabet } from "nanoid";
import { type UseFormReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export const slugRegex = /^[a-zA-Z0-9-_]*$/;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl() {
  if (process.env.DOMAIN_URL) return process.env.DOMAIN_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const nanoid = customAlphabet(
  "1234567890abcdefabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  6,
);

export function formatNumber(
  number: number | string,
  options: {
    decimals?: number;
    style?: Intl.NumberFormatOptions["style"];
    notation?: Intl.NumberFormatOptions["notation"];
  } = {},
) {
  const { decimals = 1, style = "decimal", notation = "standard" } = options;

  return new Intl.NumberFormat("en-US", {
    style,
    notation,
    maximumFractionDigits: decimals,
  }).format(Number(number));
}

export function setFormErrors(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>,
  errors: Record<string, string[]>,
) {
  for (const [field, messages] of Object.entries(errors)) {
    form.setError(field, { message: messages.join(" ") });
  }
}
