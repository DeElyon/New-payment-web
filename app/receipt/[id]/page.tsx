"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
import PaymentReceipt from "@/components/payment-receipt"
import { getPaymentById } from "@/lib/payment-service"
import type { PaymentDetails } from "@/types/payment"

export default function ReceiptPage() {
  const params = useParams()
  const router = useRouter()
  const [payment, setPayment] = useState<PaymentDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState(10)
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        if (typeof params.id !== "string") {
          router.push("/")
          return
        }

        const paymentData = await getPaymentById(params.id)
        if (!paymentData) {
          router.push("/")
          return
        }

        setPayment(paymentData)
      } catch (error) {
        console.error("Error fetching payment:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPayment()
  }, [params.id, router])

  useEffect(() => {
    if (payment?.status === "completed" && !redirecting) {
      setRedirecting(true)

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            window.location.href = "https://wa.link/gvw4ue"
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [payment, redirecting])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Receipt Not Found</h2>
          <p className="mb-6">The receipt you are looking for does not exist or has been removed.</p>
          <Button onClick={() => router.push("/")}>Return to Home</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PaymentReceipt paymentDetails={payment} countdown={redirecting ? countdown : null} />
    </div>
  )
}
