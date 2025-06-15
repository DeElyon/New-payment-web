"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AnimatedLoader } from "@/components/ui/animated-loader"
import PaymentReceipt from "@/components/payment-receipt"
import { getPaymentById } from "@/lib/payment-service"
import type { PaymentDetails } from "@/types/payment"
import { ArrowLeft, Globe, ExternalLink } from "lucide-react"
import Link from "next/link"

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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-green-900/20 dark:to-blue-900/20">
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Card className="bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-950">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <AnimatedLoader size="lg" variant="pulse" className="mb-4" />
              <div className="text-lg font-medium text-green-600 dark:text-green-400">Loading receipt...</div>
              <div className="text-sm text-green-500 dark:text-green-500 mt-2">Preparing your payment details</div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-red-900/20 dark:to-orange-900/20">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto p-6 text-center bg-gradient-to-br from-white to-red-50 dark:from-gray-900 dark:to-red-950 border-2 border-red-200">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">❌</span>
              </div>
              <h2 className="text-2xl font-bold text-red-700 dark:text-red-300">Receipt Not Found</h2>
              <p className="text-red-600 dark:text-red-400">
                The receipt you are looking for does not exist or has been removed.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => router.push("/")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to Payment Portal
                </Button>
                <Button asChild variant="outline" className="border-2 border-purple-300 hover:bg-purple-50">
                  <Link href="https://elcoders-portfolio-web.vercel.app/" target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-4 w-4" />
                    Visit Our Portfolio
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-green-900/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Payment Receipt
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Your payment confirmation from ELCODERS</p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline" className="border-2 border-green-300 hover:bg-green-50">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  New Payment
                </Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
              >
                <Link href="https://elcoders-portfolio-web.vercel.app/" target="_blank" rel="noopener noreferrer">
                  <Globe className="mr-2 h-4 w-4" />
                  Our Portfolio
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Receipt */}
        <PaymentReceipt paymentDetails={payment} countdown={redirecting ? countdown : null} />
      </div>
    </div>
  )
}
