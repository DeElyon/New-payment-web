"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Download, Check, ArrowRight, ExternalLink, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { PaymentDetails } from "@/types/payment"
import { motion } from "framer-motion"
import { AnimatedLoader } from "@/components/ui/animated-loader"
import Link from "next/link"

interface PaymentReceiptProps {
  paymentDetails: PaymentDetails
  countdown: number | null
}

export default function PaymentReceipt({ paymentDetails, countdown }: PaymentReceiptProps) {
  const { toast } = useToast()
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)

    try {
      // Generate receipt content
      const receiptContent = generateReceiptHTML(paymentDetails)

      // Create blob and download
      const blob = new Blob([receiptContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `ELCODERS-Receipt-${paymentDetails.reference}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Receipt downloaded",
        description: "Your receipt has been downloaded successfully",
      })
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download receipt. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDownloading(false)
    }
  }

  const generateReceiptHTML = (payment: PaymentDetails): string => {
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
      const usdValue = Number(ngnAmount) / (payment.exchangeRate || 1890)
      return usdValue.toFixed(2)
    }

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ELCODERS Payment Receipt - ${payment.reference}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .receipt {
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .company-logo {
            width: 80px;
            height: 80px;
            background: white;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
        }
        .content {
            padding: 30px;
        }
        .status-badge {
            background: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            display: inline-flex;
            align-items: center;
            font-size: 14px;
            font-weight: bold;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #f3f4f6;
        }
        .detail-label {
            color: #6b7280;
            font-weight: 500;
        }
        .detail-value {
            font-weight: bold;
            color: #1f2937;
        }
        .footer {
            background: #f9fafb;
            padding: 20px 30px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
        }
        .website-link {
            color: #667eea;
            text-decoration: none;
            font-weight: bold;
        }
        .website-link:hover {
            text-decoration: underline;
        }
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .receipt {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <div class="company-logo">EC</div>
            <h1 style="margin: 0; font-size: 28px;">ELCODERS</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">SOFTWARE DEVELOPING COMPANY</p>
            <p style="margin: 10px 0 0 0; font-size: 18px;">Payment Receipt</p>
        </div>
        
        <div class="content">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <div>
                    <h2 style="margin: 0; color: #1f2937;">Receipt #${payment.reference}</h2>
                    <p style="margin: 5px 0 0 0; color: #6b7280;">${formatDate(payment.date)}</p>
                </div>
                <div class="status-badge">
                    ✓ Paid
                </div>
            </div>

            <div style="margin-bottom: 30px;">
                <h3 style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">CUSTOMER INFORMATION</h3>
                <div class="detail-row">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">${payment.name}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${payment.email}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Transaction ID:</span>
                    <span class="detail-value">${payment.transactionId || "N/A"}</span>
                </div>
            </div>

            <div style="margin-bottom: 30px;">
                <h3 style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">PAYMENT DETAILS</h3>
                <div class="detail-row">
                    <span class="detail-label">Amount (NGN):</span>
                    <span class="detail-value">₦${Number(payment.amount).toLocaleString()}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Amount (USD):</span>
                    <span class="detail-value">$${calculateUsdAmount(payment.amount)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Exchange Rate:</span>
                    <span class="detail-value">₦${payment.exchangeRate?.toLocaleString() || "1890"} = $1</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Payment Method:</span>
                    <span class="detail-value">${
                      payment.paymentMethod === "bank"
                        ? `Bank Transfer (${payment.bankAccount === "access" ? "ACCESS BANK" : "SMARTCASH PAYMENT SERVICE BANK"})`
                        : `Cryptocurrency (USDT ${payment.cryptoNetwork?.toUpperCase()})`
                    }</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Reference:</span>
                    <span class="detail-value">${payment.reference}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${formatDate(payment.date)}</span>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p style="margin: 0 0 10px 0;">Thank you for your payment!</p>
            <p style="margin: 0;">Visit our website: <a href="https://elcoders-portfolio-web.vercel.app/" class="website-link">https://elcoders-portfolio-web.vercel.app/</a></p>
            <p style="margin: 10px 0 0 0; font-size: 12px;">This is an automatically generated receipt. Please keep it for your records.</p>
        </div>
    </div>
</body>
</html>
    `
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
      <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-950 border-2 border-green-200 dark:border-green-800">
        <CardHeader className="text-center border-b bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">Payment Receipt</CardTitle>
          <CardDescription className="text-green-100">ELCODERS SOFTWARE DEVELOPING COMPANY</CardDescription>
          <div className="mt-4">
            <Button asChild variant="outline" className="bg-white text-green-600 border-white hover:bg-green-50">
              <Link href="https://elcoders-portfolio-web.vercel.app/" target="_blank" rel="noopener noreferrer">
                <Globe className="mr-2 h-4 w-4" />
                Visit Our Portfolio
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg text-green-700 dark:text-green-300">
                Receipt #{paymentDetails.reference}
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400">{formatDate(paymentDetails.date)}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-4 py-2 rounded-full flex items-center border-2 border-green-300">
              <Check className="h-5 w-5 mr-2" />
              <span className="font-bold">Paid</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border-2 border-blue-200">
              <h4 className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-3">CUSTOMER INFORMATION</h4>
              <div className="space-y-2">
                <p className="font-medium text-blue-800 dark:text-blue-200">{paymentDetails.name}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">{paymentDetails.email}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Transaction ID: {paymentDetails.transactionId}
                </p>
              </div>
            </div>

            <Separator className="border-2 border-gray-200" />

            <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border-2 border-purple-200">
              <h4 className="text-sm font-bold text-purple-700 dark:text-purple-300 mb-3">PAYMENT DETAILS</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-purple-600 dark:text-purple-400 font-medium">Amount (NGN)</span>
                  <span className="font-bold text-lg text-purple-700 dark:text-purple-300">
                    ₦{Number(paymentDetails.amount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-600 dark:text-purple-400 font-medium">Amount (USD)</span>
                  <span className="font-bold text-lg text-green-600 dark:text-green-400">
                    ${calculateUsdAmount(paymentDetails.amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-600 dark:text-purple-400 font-medium">Exchange Rate</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                    ₦{paymentDetails.exchangeRate?.toLocaleString() || "1890"} = $1
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-600 dark:text-purple-400 font-medium">Payment Method</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 capitalize">
                    {paymentDetails.paymentMethod === "bank"
                      ? `Bank Transfer (${paymentDetails.bankAccount === "access" ? "ACCESS BANK" : "SMARTCASH PAYMENT SERVICE BANK"})`
                      : `Cryptocurrency (USDT ${paymentDetails.cryptoNetwork?.toUpperCase()})`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-600 dark:text-purple-400 font-medium">Reference</span>
                  <span className="font-bold text-purple-700 dark:text-purple-300">{paymentDetails.reference}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-600 dark:text-purple-400 font-medium">Date</span>
                  <span className="font-bold text-purple-700 dark:text-purple-300">
                    {formatDate(paymentDetails.date)}
                  </span>
                </div>
              </div>
            </div>

            <Separator className="border-2 border-gray-200" />

            {countdown !== null && (
              <motion.div
                className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-4 rounded-lg border-2 border-blue-300"
                animate={{ scale: countdown < 3 ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 0.5, repeat: countdown < 3 ? Number.POSITIVE_INFINITY : 0 }}
              >
                <p className="text-center flex items-center justify-center font-bold text-blue-700 dark:text-blue-300">
                  Redirecting to WhatsApp in{" "}
                  <span className="font-bold mx-2 text-2xl text-purple-600">{countdown}</span> seconds
                  <ArrowRight className="ml-2 h-5 w-5 text-green-600" />
                </p>
              </motion.div>
            )}

            <div className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 p-4 rounded-lg border-2 border-green-300 text-center">
              <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                🎉 Thank you for choosing ELCODERS! 🎉
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                Your payment has been successfully processed. We appreciate your business!
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 dark:bg-gray-800 rounded-b-lg">
          <Button
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold"
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? (
              <>
                <AnimatedLoader size="sm" className="mr-2" variant="spinner" />
                Generating Receipt...
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
