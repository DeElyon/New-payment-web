import { Suspense } from "react"
import type { Metadata } from "next"
import PaymentScene from "@/components/payment-scene"
import PaymentForm from "@/components/payment-form"
import CompanyInfo from "@/components/company-info"
import { AnimatedLoader } from "@/components/ui/animated-loader"
import ExchangeRateDisplay from "@/components/exchange-rate-display"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Globe, ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "ELCODERS Payment Portal",
  description: "Make payments to ELCODERS SOFTWARE DEVELOPING COMPANY",
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent mb-4">
            ELCODERS Payment Portal
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6">
            Secure payments for professional software development services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold"
            >
              <Link href="https://elcoders-portfolio-web.vercel.app/" target="_blank" rel="noopener noreferrer">
                <Globe className="mr-2 h-5 w-5" />
                Visit Our Portfolio
                <ExternalLink className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-purple-300 hover:bg-purple-50">
              <Link href="/history">
                <ArrowRight className="mr-2 h-5 w-5" />
                View Payment History
              </Link>
            </Button>
          </div>
        </div>

        {/* Exchange Rate Display */}
        <div className="mb-6">
          <ExchangeRateDisplay />
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 3D Scene */}
          <div className="lg:w-1/2 h-[400px] lg:h-[600px]">
            <Suspense
              fallback={
                <Card className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
                  <CardContent className="flex flex-col items-center">
                    <AnimatedLoader size="lg" variant="wave" className="mb-4" />
                    <div className="text-lg font-medium text-blue-600 dark:text-blue-400">Loading 3D Experience...</div>
                    <div className="text-sm text-blue-500 dark:text-blue-500 mt-2">Preparing interactive elements</div>
                  </CardContent>
                </Card>
              }
            >
              <PaymentScene />
            </Suspense>
          </div>

          {/* Forms Section */}
          <div className="lg:w-1/2 flex flex-col gap-8">
            <CompanyInfo />
            <PaymentForm />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-blue-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">🔒</span>
              </div>
              <h3 className="font-bold text-blue-700 dark:text-blue-300 mb-2">Secure Payments</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Your transactions are protected with enterprise-grade security
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-2 border-purple-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">⚡</span>
              </div>
              <h3 className="font-bold text-purple-700 dark:text-purple-300 mb-2">Instant Processing</h3>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Fast payment verification and immediate receipt generation
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-2 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">🌍</span>
              </div>
              <h3 className="font-bold text-green-700 dark:text-green-300 mb-2">Global Support</h3>
              <p className="text-sm text-green-600 dark:text-green-400">
                Multiple payment methods and currencies supported worldwide
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Work with ELCODERS?</h2>
              <p className="text-purple-100 mb-6">
                Join hundreds of satisfied clients who trust us with their software development needs
              </p>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white text-purple-600 border-white hover:bg-purple-50"
              >
                <Link href="https://elcoders-portfolio-web.vercel.app/" target="_blank" rel="noopener noreferrer">
                  <Globe className="mr-2 h-5 w-5" />
                  Explore Our Services
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
