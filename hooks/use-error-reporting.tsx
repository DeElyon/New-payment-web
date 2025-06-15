"use client"

import { useCallback } from "react"

interface ErrorReport {
  message: string
  stack?: string
  timestamp: number
  url: string
  userAgent: string
  context?: Record<string, any>
}

export function useErrorReporting() {
  const reportError = useCallback((error: Error, context?: Record<string, any>) => {
    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      context,
    }

    // Log to console for development
    console.error("Error reported:", errorReport)

    // Store in localStorage for later analysis
    try {
      const existingErrors = JSON.parse(localStorage.getItem("error_reports") || "[]")
      const updatedErrors = [...existingErrors, errorReport].slice(-50) // Keep last 50 errors
      localStorage.setItem("error_reports", JSON.stringify(updatedErrors))
    } catch (storageError) {
      console.warn("Failed to store error report:", storageError)
    }

    // In a real application, you would send this to your error reporting service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    // sendToErrorService(errorReport)
  }, [])

  const getErrorReports = useCallback((): ErrorReport[] => {
    try {
      return JSON.parse(localStorage.getItem("error_reports") || "[]")
    } catch (error) {
      console.warn("Failed to get error reports:", error)
      return []
    }
  }, [])

  const clearErrorReports = useCallback(() => {
    try {
      localStorage.removeItem("error_reports")
    } catch (error) {
      console.warn("Failed to clear error reports:", error)
    }
  }, [])

  return {
    reportError,
    getErrorReports,
    clearErrorReports,
  }
}
