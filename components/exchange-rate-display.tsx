"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, RefreshCw } from "lucide-react"
import { useExchangeRate } from "@/hooks/use-exchange-rate"
import { cn } from "@/lib/utils"

export default function ExchangeRateDisplay() {
  const { rate, loading, refreshRate } = useExchangeRate()
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
    const timeout = setTimeout(() => setAnimate(false), 1000)
    return () => clearTimeout(timeout)
  }, [rate])

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-primary" />
            <span className="font-medium">Current Exchange Rate:</span>
            <Badge
              variant="outline"
              className={cn("bg-primary text-primary-foreground font-bold transition-all", animate && "scale-110")}
            >
              ₦{rate.toLocaleString()} = $1
            </Badge>
          </div>
          <button
            onClick={refreshRate}
            disabled={loading}
            className="text-primary hover:text-primary/80 transition-colors"
            aria-label="Refresh exchange rate"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
