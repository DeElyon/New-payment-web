"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

interface OfflineAction {
  type: string
  data: any
  timestamp: number
  id: string
}

export function useOfflineSupport() {
  const [isOnline, setIsOnline] = useState(true)
  const [queuedActions, setQueuedActions] = useState<OfflineAction[]>([])
  const { toast } = useToast()

  // Check online status
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    // Set initial status
    updateOnlineStatus()

    // Listen for online/offline events
    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [])

  // Load queued actions from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("offline_actions")
      if (saved) {
        setQueuedActions(JSON.parse(saved))
      }
    } catch (error) {
      console.warn("Failed to load offline actions:", error)
    }
  }, [])

  // Save queued actions to localStorage
  const saveQueuedActions = useCallback((actions: OfflineAction[]) => {
    try {
      localStorage.setItem("offline_actions", JSON.stringify(actions))
    } catch (error) {
      console.warn("Failed to save offline actions:", error)
    }
  }, [])

  // Queue an action for offline processing
  const queueOfflineAction = useCallback(
    (action: Omit<OfflineAction, "id" | "timestamp">) => {
      const newAction: OfflineAction = {
        ...action,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      }

      setQueuedActions((prev) => {
        const updated = [...prev, newAction]
        saveQueuedActions(updated)
        return updated
      })

      toast({
        title: "Action queued",
        description: "This action will be processed when you're back online",
      })
    },
    [saveQueuedActions, toast],
  )

  // Process queued actions when back online
  useEffect(() => {
    if (isOnline && queuedActions.length > 0) {
      toast({
        title: "Back online",
        description: `Processing ${queuedActions.length} queued action(s)`,
      })

      // Process actions (in a real app, you'd implement the actual processing)
      setTimeout(() => {
        setQueuedActions([])
        saveQueuedActions([])

        toast({
          title: "Actions processed",
          description: "All queued actions have been processed",
        })
      }, 2000)
    }
  }, [isOnline, queuedActions.length, saveQueuedActions, toast])

  // Clear expired actions (older than 24 hours)
  useEffect(() => {
    const clearExpiredActions = () => {
      const now = Date.now()
      const dayInMs = 24 * 60 * 60 * 1000

      setQueuedActions((prev) => {
        const filtered = prev.filter((action) => now - action.timestamp < dayInMs)
        if (filtered.length !== prev.length) {
          saveQueuedActions(filtered)
        }
        return filtered
      })
    }

    const interval = setInterval(clearExpiredActions, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [saveQueuedActions])

  return {
    isOnline,
    queuedActions,
    queueOfflineAction,
  }
}
