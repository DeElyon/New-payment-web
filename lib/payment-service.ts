import { v4 as uuidv4 } from "uuid"
import type { PaymentDetails, PaymentStatus } from "@/types/payment"

// Simulated database
let payments: PaymentDetails[] = []

// Load payments from localStorage if available
if (typeof window !== "undefined") {
  try {
    const savedPayments = localStorage.getItem("payments")
    if (savedPayments) {
      payments = JSON.parse(savedPayments)
    }
  } catch (error) {
    console.warn("Failed to load payments from localStorage (this may be due to service worker issues):", error)
    payments = []
  }
}

// Save payments to localStorage
const savePayments = () => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("payments", JSON.stringify(payments))
    } catch (error) {
      console.warn("Failed to save payments to localStorage (this may be due to service worker issues):", error)
      // Continue without saving - the app will still work in memory
    }
  }
}

export async function getPayments(): Promise<PaymentDetails[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Return a copy of the payments array
  return [...payments]
}

export async function getPaymentById(id: string): Promise<PaymentDetails | null> {
  // Validate input
  if (!id) {
    console.error("Invalid payment ID")
    return null
  }

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Find payment by ID
  const payment = payments.find((p) => p.id === id)

  return payment || null
}

export async function createPayment(payment: Omit<PaymentDetails, "id">): Promise<PaymentDetails> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Create new payment with ID
  const newPayment: PaymentDetails = {
    ...payment,
    id: uuidv4(),
  }

  // Add to payments array
  payments.push(newPayment)

  // Save to localStorage
  savePayments()

  return newPayment
}

export async function verifyPayment(payment: Partial<PaymentDetails>): Promise<PaymentDetails> {
  // Ensure payment has an id
  if (!payment || !payment.id) {
    throw new Error("Payment ID is required for verification")
  }

  // Simulate API call delay and verification process
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Find existing payment
  const existingPaymentIndex = payments.findIndex((p) => p.id === payment.id)

  let verifiedPayment: PaymentDetails

  if (existingPaymentIndex >= 0) {
    // Update existing payment
    payments[existingPaymentIndex] = {
      ...payments[existingPaymentIndex],
      ...payment,
      status: "completed" as PaymentStatus,
    }
    verifiedPayment = payments[existingPaymentIndex]
  } else {
    // Create new payment with required fields if it doesn't exist
    verifiedPayment = {
      id: payment.id,
      amount: payment.amount || "0",
      email: payment.email || "",
      name: payment.name || "",
      reference: payment.reference || "",
      paymentMethod: payment.paymentMethod || "bank",
      status: "completed" as PaymentStatus,
      date: payment.date || new Date().toISOString(),
      ...payment,
    }
    payments.push(verifiedPayment)
  }

  // Save to localStorage
  savePayments()

  return verifiedPayment
}

export async function updatePayment(id: string, updates: Partial<PaymentDetails>): Promise<PaymentDetails | null> {
  // Validate input
  if (!id) {
    console.error("Invalid payment ID")
    return null
  }

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Find payment by ID
  const index = payments.findIndex((p) => p.id === id)

  if (index === -1) {
    return null
  }

  // Update payment
  payments[index] = {
    ...payments[index],
    ...updates,
  }

  // Save to localStorage
  savePayments()

  return payments[index]
}

export async function deletePayment(id: string): Promise<boolean> {
  // Validate input
  if (!id) {
    console.error("Invalid payment ID")
    return false
  }

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Find payment by ID
  const index = payments.findIndex((p) => p.id === id)

  if (index === -1) {
    return false
  }

  // Remove payment
  payments.splice(index, 1)

  // Save to localStorage
  savePayments()

  return true
}
