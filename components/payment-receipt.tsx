"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Download, Check, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { PaymentDetails } from "@/types/payment"
import { motion } from "framer-motion"

interface PaymentReceiptProps {
  paymentDetails: PaymentDetails
  countdown: number | null
}

export default function PaymentReceipt({ paymentDetails, countdown }: PaymentReceiptProps) {
  const { toast } = useToast()
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)

    // Simulate download delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Receipt downloaded",
      description: "Your receipt has been downloaded successfully",
    })

    setDownloading(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date)
  }

  const calculateUsdAmount = (ngnAmount: string): string => {
    if (!ngnAmount || isNaN(Number(ngnAmount))) return "0.00"
    const usdValue = Number(ngnAmount) / (paymentDetails.exchangeRate || 1890)
    return usdValue.toFixed(2)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center border-b">
          <CardTitle className="text-2xl">Payment Receipt</CardTitle>
          <CardDescription>ELCODERS SOFTWARE DEVELOPING COMPANY</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Receipt #{paymentDetails.reference}</h3>
              <p className="text-sm text-muted-foreground">{formatDate(paymentDetails.date)}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full flex items-center">
              <Check className="h-4 w-4 mr-1" />
              <span>Paid</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Customer Information</h4>
              <div className="mt-1">
                <p className="font-medium">{paymentDetails.name}</p>
                <p className="text-sm">{paymentDetails.email}</p>
                <p className="text-sm text-muted-foreground">Transaction ID: {paymentDetails.transactionId}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Payment Details</h4>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span>Amount (NGN)</span>
                  <span className="font-medium">₦{Number(paymentDetails.amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount (USD)</span>
                  <span className="font-medium">${calculateUsdAmount(paymentDetails.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Exchange Rate</span>
                  <span className="font-medium">₦{paymentDetails.exchangeRate?.toLocaleString() || "1890"} = $1</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span className="font-medium capitalize">
                    {paymentDetails.paymentMethod === "bank"
                      ? `Bank Transfer (${paymentDetails.bankAccount === "access" ? "ACCESS BANK" : "Stanbic IBTC"})`
                      : `Cryptocurrency (USDT ${paymentDetails.cryptoNetwork?.toUpperCase()})`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Reference</span>
                  <span className="font-medium">{paymentDetails.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date</span>
                  <span className="font-medium">{formatDate(paymentDetails.date)}</span>
                </div>
              </div>
            </div>

            <Separator />

            {countdown !== null && (
              <motion.div
                className="bg-primary/10 p-4 rounded-md"
                animate={{ scale: countdown < 3 ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 0.5, repeat: countdown < 3 ? Number.POSITIVE_INFINITY : 0 }}
              >
                <p className="text-center flex items-center justify-center">
                  Redirecting to WhatsApp in <span className="font-bold mx-2">{countdown}</span> seconds
                  <ArrowRight className="ml-2 h-4 w-4" />
                </p>
              </motion.div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleDownload} disabled={downloading}>
            {downloading ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="mr-2"
                >
                  <Download className="h-4 w-4" />
                </motion.span>
                Downloading...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> Download Receipt
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
