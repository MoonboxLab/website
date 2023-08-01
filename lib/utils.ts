import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string | undefined, length: number) {
  if (!address) return
  return `${address.substring(0, length + 2)}…${address.substring(
    address.length - length
  )}`
}