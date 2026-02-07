import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function wait(delay: number, random?: boolean) {
  if (random) delay = Math.floor(Math.random() * delay) + delay;
  return new Promise(resolve => setTimeout(resolve, delay));
}
