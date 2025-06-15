"use client"

import { useState, useEffect, useCallback } from "react"
import { getExchangeRate } from "@/lib/exchange-service"

export function useExchangeRate() {
  const [rate, setRate] = useState(1890) // Initial rate: N1890 per $1
  const [loading, setLoading] = useState(false)

  const fetchRate = useCallback(async () => {
    setLoading(true)
    try {
      const newRate = await getExchangeRate()
      setRate(newRate)
    } catch (error) {
      console.error("Failed to fetch exchange rate:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshRate = useCallback(() => {
    fetchRate()
  }, [fetchRate])

  useEffect(() => {
    fetchRate()

    // Refresh rate every 30 minutes
    const interval = setInterval(
      () => {
        fetchRate()
      },
      30 * 60 * 1000,
    )

    return () => clearInterval(interval)
  }, [fetchRate])

  return { rate, loading, refreshRate }
}
