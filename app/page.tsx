import { Suspense } from "react"
import type { Metadata } from "next"
import PaymentScene from "@/components/payment-scene"
import PaymentForm from "@/components/payment-form"
import CompanyInfo from "@/components/company-info"
import { Loader } from "@/components/ui/loader"
import ExchangeRateDisplay from "@/components/exchange-rate-display"

export const metadata: Metadata = {
  title: "ELCODERS Payment Portal",
  description: "Make payments to ELCODERS SOFTWARE DEVELOPING COMPANY",
}

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
      <div className="mb-6">
        <ExchangeRateDisplay />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2 h-[400px] lg:h-[600px]">
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <Loader size="lg" />
              </div>
            }
          >
            <PaymentScene />
          </Suspense>
        </div>
        <div className="lg:w-1/2 flex flex-col gap-8">
          <CompanyInfo />
          <PaymentForm />
        </div>
      </div>
    </div>
  )
}
