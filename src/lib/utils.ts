import { clsx, type ClassValue } from "clsx";
import { customAlphabet } from "nanoid";
import { createSafeActionClient } from "next-safe-action";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const nanoid = customAlphabet(
  "1234567890abcdefabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  6,
);

export const action = createSafeActionClient();
