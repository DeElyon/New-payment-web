"use client"

import { useCallback } from "react"

interface SessionData {
  formData: any
  paymentStarted: boolean
  paymentId: string | null
  selectedPreset: string | null
  timestamp: number
}

export function useSessionRecovery() {
  const SESSION_KEY = "payment_session"
  const SESSION_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours

  const saveSession = useCallback((data: Omit<SessionData, "timestamp">) => {
    try {
      const sessionData: SessionData = {
        ...data,
        timestamp: Date.now(),
      }
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))
    } catch (error) {
      console.warn("Failed to save session:", error)
    }
  }, [])

  const recoverSession = useCallback((): SessionData | null => {
    try {
      const saved = localStorage.getItem(SESSION_KEY)
      if (!saved) return null

      const sessionData: SessionData = JSON.parse(saved)
      const now = Date.now()

      // Check if session has expired
      if (now - sessionData.timestamp > SESSION_EXPIRY) {
        localStorage.removeItem(SESSION_KEY)
        return null
      }

      // Only recover if there's meaningful data
      if (
        sessionData.paymentStarted ||
        sessionData.formData?.amount ||
        sessionData.formData?.email ||
        sessionData.formData?.name
      ) {
        return sessionData
      }

      return null
    } catch (error) {
      console.warn("Failed to recover session:", error)
      return null
    }
  }, [])

  const clearSession = useCallback(() => {
    try {
      localStorage.removeItem(SESSION_KEY)
    } catch (error) {
      console.warn("Failed to clear session:", error)
    }
  }, [])

  const hasSession = useCallback((): boolean => {
    return recoverSession() !== null
  }, [recoverSession])

  return {
    saveSession,
    recoverSession,
    clearSession,
    hasSession,
  }
}
