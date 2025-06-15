"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wifi, Shield, Zap, Server, Activity, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface SystemStatus {
  name: string
  status: "operational" | "degraded" | "down"
  responseTime: number
  uptime: number
}

export default function TechStatusBar() {
  const [systems, setSystems] = useState<SystemStatus[]>([
    { name: "Payment Gateway", status: "operational", responseTime: 45, uptime: 99.9 },
    { name: "Security Layer", status: "operational", responseTime: 12, uptime: 100 },
    { name: "Database", status: "operational", responseTime: 8, uptime: 99.8 },
    { name: "API Services", status: "operational", responseTime: 23, uptime: 99.7 },
  ])

  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshStatus = async () => {
    setIsRefreshing(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate random status updates
    setSystems((prev) =>
      prev.map((system) => ({
        ...system,
        responseTime: Math.floor(Math.random() * 50) + 5,
        uptime: 99.5 + Math.random() * 0.5,
        status: Math.random() > 0.1 ? "operational" : ("degraded" as "operational" | "degraded"),
      })),
    )

    setLastUpdate(new Date())
    setIsRefreshing(false)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-3 w-3 text-emerald-400" />
      case "degraded":
        return <AlertTriangle className="h-3 w-3 text-amber-400" />
      case "down":
        return <AlertTriangle className="h-3 w-3 text-red-400" />
      default:
        return <Activity className="h-3 w-3 text-slate-400" />
    }
  }

  const overallStatus = systems.every((s) => s.status === "operational")
    ? "operational"
    : systems.some((s) => s.status === "down")
      ? "down"
      : "degraded"

  return (
    <Card className="w-full bg-gradient-to-r from-slate-950 via-blue-950 to-violet-950 text-white border-cyan-400/30 shadow-lg shadow-cyan-500/10">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Overall Status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className={cn(
                  "w-3 h-3 rounded-full animate-pulse",
                  overallStatus === "operational"
                    ? "bg-emerald-400"
                    : overallStatus === "degraded"
                      ? "bg-amber-400"
                      : "bg-red-400",
                )}
              ></div>
              <span className="font-semibold text-lg">
                System Status:{" "}
                <span
                  className={cn(
                    overallStatus === "operational"
                      ? "text-emerald-400"
                      : overallStatus === "degraded"
                        ? "text-amber-400"
                        : "text-red-400",
                  )}
                >
                  {overallStatus === "operational"
                    ? "All Systems Operational"
                    : overallStatus === "degraded"
                      ? "Some Issues Detected"
                      : "Service Disruption"}
                </span>
              </span>
            </div>
            <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-400/30">
              <Activity className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </div>

          {/* System Details */}
          <div className="flex flex-wrap items-center gap-4">
            {systems.map((system, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-cyan-400/20"
              >
                {getStatusIcon(system.status)}
                <div className="text-sm">
                  <div className="font-medium text-cyan-300">{system.name}</div>
                  <div className="text-xs text-slate-400">
                    {system.responseTime}ms • {system.uptime.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3">
            <div className="text-xs text-slate-400">Last updated: {lastUpdate.toLocaleTimeString()}</div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshStatus}
              disabled={isRefreshing}
              className="bg-cyan-500/20 border-cyan-400/30 text-cyan-400 hover:bg-cyan-500/30"
            >
              <RefreshCw className={cn("h-3 w-3 mr-1", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Tech Indicators */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center space-x-1">
            <Wifi className="h-3 w-3 text-emerald-400" />
            <span className="text-emerald-300">Network: Stable</span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="h-3 w-3 text-cyan-400" />
            <span className="text-cyan-300">Security: Active</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="h-3 w-3 text-amber-400" />
            <span className="text-amber-300">Performance: Optimal</span>
          </div>
          <div className="flex items-center space-x-1">
            <Server className="h-3 w-3 text-violet-400" />
            <span className="text-violet-300">Servers: 4/4 Online</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
