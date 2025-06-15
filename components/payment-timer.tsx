"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface PaymentTimerProps {
  duration: number // in seconds
  onExpire: () => void
}

export default function PaymentTimer({ duration, onExpire }: PaymentTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1
        setProgress((newTime / duration) * 100)
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, duration, onExpire])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getColorClass = () => {
    if (progress > 66) return "text-green-600"
    if (progress > 33) return "text-amber-600"
    return "text-red-600"
  }

  return (
    <Card className="w-full max-w-xs">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="text-center">
            <div className={cn("text-3xl font-bold", getColorClass())}>{formatTime(timeLeft)}</div>
            <div className="text-sm text-muted-foreground">Time remaining</div>
          </div>
          <Progress
            value={progress}
            className="h-2"
            indicatorClassName={cn(progress > 66 ? "bg-green-600" : progress > 33 ? "bg-amber-600" : "bg-red-600")}
          />
        </div>
      </CardContent>
    </Card>
  )
}
