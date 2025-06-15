import { Suspense } from "react"
import type { Metadata } from "next"
import PaymentScene from "@/components/payment-scene"
import PaymentForm from "@/components/payment-form"
import CompanyInfo from "@/components/company-info"
import CustomerService from "@/components/customer-service"
import TechStatusBar from "@/components/tech-status-bar"
import { AnimatedLoader } from "@/components/ui/animated-loader"
import ExchangeRateDisplay from "@/components/exchange-rate-display"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Globe, ArrowRight, Shield, Zap, Users } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "ELCODERS Payment Portal - Professional Software Development Services",
  description:
    "Secure payment gateway for ELCODERS SOFTWARE DEVELOPING COMPANY. Multiple payment methods, instant verification, and 24/7 customer support.",
  keywords: "payment, software development, ELCODERS, secure payments, cryptocurrency, bank transfer",
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950">
      {/* Tech Status Bar */}
      <div className="sticky top-0 z-50">
        <TechStatusBar />
      </div>

      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent mb-4">
              ELCODERS Payment Portal
            </h1>
            <div className="text-lg md:text-xl text-slate-300 mb-2">Professional Software Development Services</div>
            <div className="text-sm text-cyan-400 font-mono">Secure • Fast • Reliable • 24/7 Support</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold shadow-lg shadow-cyan-500/25"
            >
              <Link href="https://elcoders-portfolio-web.vercel.app/" target="_blank" rel="noopener noreferrer">
                <Globe className="mr-2 h-5 w-5" />
                Visit Our Portfolio
                <ExternalLink className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900"
            >
              <Link href="/history">
                <ArrowRight className="mr-2 h-5 w-5" />
                Payment History
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-slate-900"
            >
              <Link href="https://wa.me/2348061908715" target="_blank" rel="noopener noreferrer">
                <Users className="mr-2 h-5 w-5" />
                Customer Support
              </Link>
            </Button>
          </div>
        </div>

        {/* Exchange Rate Display */}
        <div className="mb-6">
          <ExchangeRateDisplay />
        </div>

        {/* Main Content */}
        <div className="flex flex-col xl:flex-row gap-8">
          {/* 3D Scene */}
          <div className="xl:w-1/2 h-[500px] xl:h-[700px]">
            <Suspense
              fallback={
                <Card className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-950 border-cyan-500/30">
                  <CardContent className="flex flex-col items-center">
                    <AnimatedLoader size="lg" variant="wave" className="mb-4" />
                    <div className="text-lg font-medium text-cyan-400">Loading 3D Experience...</div>
                    <div className="text-sm text-cyan-300 mt-2">Initializing quantum interface</div>
                  </CardContent>
                </Card>
              }
            >
              <PaymentScene />
            </Suspense>
          </div>

          {/* Forms Section */}
          <div className="xl:w-1/2 flex flex-col gap-6">
            <CompanyInfo />
            <CustomerService />
            <PaymentForm />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-emerald-900/50 to-teal-900/50 border-2 border-emerald-500/30 backdrop-blur-sm hover:border-emerald-400/50 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-emerald-400 mb-2">Enterprise Security</h3>
              <p className="text-sm text-emerald-300">
                Bank-grade encryption and security protocols protect every transaction
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border-2 border-cyan-500/30 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-cyan-400 mb-2">Lightning Fast</h3>
              <p className="text-sm text-cyan-300">
                Instant payment processing with real-time verification and receipts
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-violet-900/50 to-purple-900/50 border-2 border-violet-500/30 backdrop-blur-sm hover:border-violet-400/50 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-violet-400 mb-2">24/7 Support</h3>
              <p className="text-sm text-violet-300">Round-the-clock customer service via WhatsApp, phone, and email</p>
            </CardContent>
          </Card>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 text-white border-0 shadow-2xl shadow-cyan-500/25">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Experience Excellence?</h2>
              <p className="text-cyan-100 mb-6 text-lg">
                Join thousands of satisfied clients who trust ELCODERS with their software development needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white text-cyan-600 border-white hover:bg-cyan-50"
                >
                  <Link href="https://elcoders-portfolio-web.vercel.app/" target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-5 w-5" />
                    Explore Our Services
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-white border-white hover:bg-white/10"
                >
                  <Link href="https://wa.me/2348061908715?text=Hi, I'm interested in your services" target="_blank">
                    <Users className="mr-2 h-5 w-5" />
                    Get Started Today
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
