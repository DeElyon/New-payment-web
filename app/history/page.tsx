import { Suspense } from "react"
import PaymentHistory from "@/components/payment-history"
import { Loader } from "@/components/ui/loader"

export default function HistoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Payment History</h1>
      <Suspense fallback={<Loader size="lg" className="mx-auto" />}>
        <PaymentHistory />
      </Suspense>
    </div>
  )
}
