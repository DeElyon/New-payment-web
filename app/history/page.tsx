import { Suspense } from "react"
import PaymentHistory from "@/components/payment-history"
import { AnimatedLoader } from "@/components/ui/animated-loader"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Globe, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Payment History
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Track all your payments to ELCODERS SOFTWARE DEVELOPING COMPANY
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline" className="border-2 border-purple-300 hover:bg-purple-50">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Payment
                </Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
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

        {/* Content */}
        <Suspense
          fallback={
            <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <AnimatedLoader size="lg" variant="dots" className="mb-4" />
                <div className="text-lg font-medium text-purple-600 dark:text-purple-400">
                  Loading payment history...
                </div>
                <div className="text-sm text-purple-500 dark:text-purple-500 mt-2">
                  Fetching your transaction records
                </div>
              </CardContent>
            </Card>
          }
        >
          <PaymentHistory />
        </Suspense>
      </div>
    </div>
  )
}
