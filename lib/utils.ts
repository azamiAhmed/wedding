import { clsx, type ClassValue } from "clsx"
import { customAlphabet } from "nanoid"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const alphabet = "abcdefghjkmnpqrstuvwxyz23456789"
export const generateSlug = customAlphabet(alphabet, 10)
