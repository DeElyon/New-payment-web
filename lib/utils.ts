import { type ClassValue, clsx } from "clsx"

// Simple utility function to merge classes without tailwind-merge dependency
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function formatCurrency(amount: number | string, currency = "NGN"): string {
  const numAmount = typeof amount === "string" ? Number.parseFloat(amount) : amount

  if (isNaN(numAmount)) {
    return "Invalid amount"
  }

  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  })

  return formatter.format(numAmount)
}

export function generateReference(): string {
  return `ELC-${Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0")}`
}
