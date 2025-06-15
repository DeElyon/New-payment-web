"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { PaymentDetails } from "@/types/payment"
import { getPayments } from "@/lib/payment-service"

interface PaymentContextType {
  payments: PaymentDetails[]
  addPayment: (payment: PaymentDetails) => void
  updatePayment: (id: string, payment: Partial<PaymentDetails>) => void
  removePayment: (id: string) => void
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined)

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [payments, setPayments] = useState<PaymentDetails[]>([])

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getPayments()
        setPayments(data || [])
      } catch (error) {
        console.error("Failed to fetch payments:", error)
        setPayments([])
      }
    }

    fetchPayments()
  }, [])

  const addPayment = (payment: PaymentDetails) => {
    // Ensure payment and payment.id are defined
    if (!payment || !payment.id) {
      console.error("Cannot add payment: payment or payment.id is undefined")
      return
    }

    setPayments((prev) => {
      // Check if payment with this ID already exists
      const exists = prev.some((p) => p.id === payment.id)
      if (exists) {
        // Update existing payment
        return prev.map((p) => (p.id === payment.id ? { ...p, ...payment } : p))
      }
      // Add new payment
      return [...prev, payment]
    })
  }

  const updatePayment = (id: string, updatedPayment: Partial<PaymentDetails>) => {
    // Ensure id is defined
    if (!id) {
      console.error("Cannot update payment: id is undefined")
      return
    }

    setPayments((prev) => prev.map((payment) => (payment.id === id ? { ...payment, ...updatedPayment } : payment)))
  }

  const removePayment = (id: string) => {
    // Ensure id is defined
    if (!id) {
      console.error("Cannot remove payment: id is undefined")
      return
    }

    setPayments((prev) => prev.filter((payment) => payment.id !== id))
  }

  return (
    <PaymentContext.Provider value={{ payments, addPayment, updatePayment, removePayment }}>
      {children}
    </PaymentContext.Provider>
  )
}

export function usePayment() {
  const context = useContext(PaymentContext)
  if (context === undefined) {
    throw new Error("usePayment must be used within a PaymentProvider")
  }
  return context
}
