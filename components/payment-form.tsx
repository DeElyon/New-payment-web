"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Copy, Clock, AlertCircle, DollarSign, WifiOff, RefreshCw, MessageCircle, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import PaymentTimer from "@/components/payment-timer"
import { useExchangeRate } from "@/hooks/use-exchange-rate"
import { usePayment } from "@/context/payment-context"
import { AnimatedLoader } from "@/components/ui/animated-loader"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PaymentMethod, BankAccount, CryptoNetwork, PaymentStatus } from "@/types/payment"
import { createPayment, verifyPayment } from "@/lib/payment-service"
import { predefinedAmounts } from "@/lib/constants"
import { useOfflineSupport } from "@/hooks/use-offline-support"
import { useSessionRecovery } from "@/hooks/use-session-recovery"
import { useErrorReporting } from "@/hooks/use-error-reporting"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function PaymentForm() {
  const { toast } = useToast()
  const router = useRouter()
  const { rate } = useExchangeRate()
  const { addPayment } = usePayment()
  const { isOnline, queueOfflineAction } = useOfflineSupport()
  const { saveSession, recoverSession, clearSession } = useSessionRecovery()
  const { reportError } = useErrorReporting()

  const [formData, setFormData] = useState({
    amount: "",
    email: "",
    name: "",
    reference: "",
    transactionId: "",
    paymentMethod: "bank" as PaymentMethod,
    bankAccount: "access" as BankAccount,
    cryptoNetwork: "trc20" as CryptoNetwork,
  })

  const [paymentStarted, setPaymentStarted] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [timerExpired, setTimerExpired] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [sessionRecovered, setSessionRecovered] = useState(false)

  // Progressive enhancement check
  const [hasJavaScript, setHasJavaScript] = useState(false)
  const [supportsClipboard, setSupportsClipboard] = useState(false)

  // Initialize progressive enhancement features
  useEffect(() => {
    setHasJavaScript(true)
    setSupportsClipboard(!!navigator.clipboard)
  }, [])

  // Session recovery on component mount
  useEffect(() => {
    const recovered = recoverSession()
    if (recovered) {
      setFormData(recovered.formData)
      setPaymentStarted(recovered.paymentStarted)
      setPaymentId(recovered.paymentId)
      setSelectedPreset(recovered.selectedPreset)
      setSessionRecovered(true)

      toast({
        title: "Session recovered",
        description: "Your previous payment session has been restored",
      })
    }
  }, [recoverSession, toast])

  // Auto-save session data
  useEffect(() => {
    if (paymentStarted || formData.amount || formData.email || formData.name) {
      saveSession({
        formData,
        paymentStarted,
        paymentId,
        selectedPreset,
        timestamp: Date.now(),
      })
    }
  }, [formData, paymentStarted, paymentId, selectedPreset, saveSession])

  // Generate a random reference number
  useEffect(() => {
    if (!formData.reference) {
      const reference = `ELC-${Math.floor(Math.random() * 1000000)}`
      setFormData((prev) => ({ ...prev, reference }))
    }
  }, [formData.reference])

  const handleCopy = async (text: string, label: string) => {
    try {
      if (supportsClipboard) {
        await navigator.clipboard.writeText(text)
        toast({
          title: "Copied!",
          description: `${label} copied to clipboard`,
        })
      } else {
        // Fallback for browsers without clipboard API
        const textArea = document.createElement("textarea")
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)

        toast({
          title: "Copied!",
          description: `${label} copied to clipboard`,
        })
      }
    } catch (error) {
      reportError(error as Error, { context: "clipboard_copy", text, label })

      // Manual copy fallback
      toast({
        title: "Copy failed",
        description: `Please manually copy: ${text}`,
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear preset selection if amount is changed manually
    if (name === "amount") {
      setSelectedPreset(null)
    }
  }

  const handlePaymentMethodChange = (value: PaymentMethod) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }))
  }

  const handleBankAccountChange = (value: BankAccount) => {
    setFormData((prev) => ({ ...prev, bankAccount: value }))
  }

  const handleCryptoNetworkChange = (value: CryptoNetwork) => {
    setFormData((prev) => ({ ...prev, cryptoNetwork: value }))
  }

  const handlePresetAmountChange = (value: string) => {
    const selectedAmount = predefinedAmounts.find((a) => a.id === value)
    if (selectedAmount) {
      setFormData((prev) => ({ ...prev, amount: selectedAmount.ngn.toString() }))
      setSelectedPreset(value)
    }
  }

  const startPayment = async () => {
    if (!formData.amount || !formData.email || !formData.name) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      if (!isOnline) {
        // Queue action for when online
        queueOfflineAction({
          type: "CREATE_PAYMENT",
          data: {
            ...formData,
            amount: formData.amount,
            status: "pending" as PaymentStatus,
            date: new Date().toISOString(),
            exchangeRate: rate,
          },
        })

        toast({
          title: "Offline mode",
          description: "Payment will be processed when connection is restored",
        })
        return
      }

      const payment = await createPayment({
        ...formData,
        amount: formData.amount,
        status: "pending" as PaymentStatus,
        date: new Date().toISOString(),
        exchangeRate: rate,
      })

      // Store the payment ID for later use
      setPaymentId(payment.id)

      // Add payment to context with error handling
      try {
        addPayment(payment)
      } catch (contextError) {
        reportError(contextError as Error, { context: "payment_context_update" })
        console.warn("Context update failed, continuing with payment:", contextError)
      }

      setPaymentStarted(true)

      toast({
        title: "Payment initiated",
        description: "You have 15 minutes to complete your payment",
      })
    } catch (error) {
      reportError(error as Error, { context: "create_payment", formData })
      console.error("Error creating payment:", error)
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const completePayment = async () => {
    if (!formData.transactionId) {
      toast({
        title: "Transaction ID required",
        description: "Please enter the transaction ID to verify your payment",
        variant: "destructive",
      })
      return
    }

    if (!paymentId) {
      toast({
        title: "Payment error",
        description: "Payment session is invalid. Please start again.",
        variant: "destructive",
      })
      return
    }

    setVerifying(true)

    try {
      if (!isOnline) {
        // Queue action for when online
        queueOfflineAction({
          type: "VERIFY_PAYMENT",
          data: {
            id: paymentId,
            ...formData,
            amount: formData.amount,
            status: "completed" as PaymentStatus,
            date: new Date().toISOString(),
            exchangeRate: rate,
          },
        })

        toast({
          title: "Offline mode",
          description: "Payment verification will be processed when connection is restored",
        })
        setVerifying(false)
        return
      }

      const verifiedPayment = await verifyPayment({
        id: paymentId,
        ...formData,
        amount: formData.amount,
        status: "completed" as PaymentStatus,
        date: new Date().toISOString(),
        exchangeRate: rate,
      })

      addPayment(verifiedPayment)

      // Clear session after successful payment
      clearSession()

      toast({
        title: "Payment verified",
        description: "Your payment has been successfully verified",
      })

      // Redirect to receipt page
      router.push(`/receipt/${verifiedPayment.id}`)
    } catch (error) {
      reportError(error as Error, { context: "verify_payment", paymentId, formData })
      console.error("Error verifying payment:", error)
      toast({
        title: "Verification failed",
        description: "Could not verify your payment. Please check the transaction ID and try again.",
        variant: "destructive",
      })
    } finally {
      setVerifying(false)
    }
  }

  const handleTimerExpired = () => {
    setTimerExpired(true)
    clearSession() // Clear expired session
    toast({
      title: "Time expired",
      description: "Your payment session has expired. Please start a new payment.",
      variant: "destructive",
    })
  }

  const calculateUsdAmount = (ngnAmount: string): string => {
    if (!ngnAmount || isNaN(Number(ngnAmount))) return "0.00"
    const usdValue = Number(ngnAmount) / rate
    return usdValue.toFixed(2)
  }

  const retryConnection = () => {
    window.location.reload()
  }

  return (
    <Card className="w-full animate-in bg-gradient-to-br from-slate-800/50 to-blue-900/50 border-2 border-cyan-500/30 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold flex items-center">
          <Shield className="mr-3 h-6 w-6" />
          Secure Payment Portal
        </CardTitle>
        <CardDescription className="text-cyan-100">
          Professional payment processing for ELCODERS SOFTWARE DEVELOPING COMPANY
        </CardDescription>

        {/* Offline indicator */}
        {!isOnline && (
          <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 mt-4">
            <WifiOff className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>You are currently offline. Actions will be queued until connection is restored.</span>
              <Button variant="outline" size="sm" onClick={retryConnection}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Session recovery indicator */}
        {sessionRecovered && (
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 mt-4">
            <AlertDescription>
              Your previous payment session has been restored. You can continue where you left off.
            </AlertDescription>
          </Alert>
        )}

        {/* Customer support quick access */}
        <div className="mt-4">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
          >
            <Link href="https://wa.me/2348061908715?text=Hi, I need help with payment" target="_blank">
              <MessageCircle className="mr-2 h-4 w-4" />
              Need Help? Contact Support
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {!paymentStarted ? (
          <div className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label className="text-lg font-semibold text-cyan-400">Select Amount</Label>
                <Select value={selectedPreset || ""} onValueChange={handlePresetAmountChange}>
                  <SelectTrigger className="border-2 border-cyan-500/30 focus:border-cyan-400 bg-slate-800/50">
                    <SelectValue placeholder="Choose a predefined amount" />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedAmounts.map((amount) => (
                      <SelectItem key={amount.id} value={amount.id}>
                        ₦{amount.ngn.toLocaleString()} (${amount.usd.toLocaleString()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="amount" className="text-lg font-semibold text-cyan-400">
                  Custom Amount (NGN)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 font-bold">₦</span>
                  <Input
                    id="amount"
                    name="amount"
                    className="pl-8 border-2 border-cyan-500/30 focus:border-cyan-400 bg-slate-800/50 text-white"
                    placeholder="Enter amount in Naira"
                    value={formData.amount}
                    onChange={handleInputChange}
                  />
                </div>
                {formData.amount && !isNaN(Number(formData.amount)) && (
                  <div className="text-sm text-green-400 flex items-center font-medium">
                    <DollarSign className="h-3 w-3 mr-1" />
                    <span>USD Equivalent: ${calculateUsdAmount(formData.amount)}</span>
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name" className="text-lg font-semibold text-cyan-400">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  className="border-2 border-cyan-500/30 focus:border-cyan-400 bg-slate-800/50 text-white"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-lg font-semibold text-cyan-400">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="border-2 border-cyan-500/30 focus:border-cyan-400 bg-slate-800/50 text-white"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <Tabs defaultValue="bank" onValueChange={(value) => handlePaymentMethodChange(value as PaymentMethod)}>
              <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
                <TabsTrigger value="bank" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
                  Bank Transfer
                </TabsTrigger>
                <TabsTrigger
                  value="crypto"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Cryptocurrency
                </TabsTrigger>
              </TabsList>
              <TabsContent value="bank" className="space-y-4 pt-4">
                <RadioGroup
                  defaultValue="access"
                  onValueChange={(value) => handleBankAccountChange(value as BankAccount)}
                >
                  <div className="flex items-center space-x-2 border-2 border-green-500/30 rounded-md p-3 bg-green-900/20">
                    <RadioGroupItem value="access" id="access" />
                    <Label htmlFor="access" className="flex-1">
                      <div className="font-medium text-green-400">ACCESS BANK</div>
                      <div className="text-sm text-green-300">1907856695</div>
                      <div className="text-sm text-green-300">EBUBECHUKWU IFEANYI ELIJAH</div>
                    </Label>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy("1907856695", "Account number")}
                      className="text-green-400 hover:text-green-300"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2 border-2 border-orange-500/30 rounded-md p-3 bg-orange-900/20">
                    <RadioGroupItem value="smartcash" id="smartcash" />
                    <Label htmlFor="smartcash" className="flex-1">
                      <div className="font-medium text-orange-400">SMARTCASH PAYMENT SERVICE BANK</div>
                      <div className="text-sm text-orange-300">8088578817</div>
                      <div className="text-sm text-orange-300">IFEANYI ONUOHA</div>
                    </Label>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy("8088578817", "Account number")}
                      className="text-orange-400 hover:text-orange-300"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </RadioGroup>
              </TabsContent>
              <TabsContent value="crypto" className="space-y-4 pt-4">
                <RadioGroup
                  defaultValue="trc20"
                  onValueChange={(value) => handleCryptoNetworkChange(value as CryptoNetwork)}
                >
                  <div className="flex items-center space-x-2 border-2 border-purple-500/30 rounded-md p-3 bg-purple-900/20">
                    <RadioGroupItem value="trc20" id="trc20" />
                    <Label htmlFor="trc20" className="flex-1">
                      <div className="font-medium text-purple-400">USDT (TRC20)</div>
                      <div className="text-sm text-purple-300 truncate">TV8rxyuDHeyrBGMzc8bvbrbfDTH4MMEmNh</div>
                    </Label>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy("TV8rxyuDHeyrBGMzc8bvbrbfDTH4MMEmNh", "TRC20 address")}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2 border-2 border-indigo-500/30 rounded-md p-3 bg-indigo-900/20">
                    <RadioGroupItem value="erc20" id="erc20" />
                    <Label htmlFor="erc20" className="flex-1">
                      <div className="font-medium text-indigo-400">USDT (ERC20)</div>
                      <div className="text-sm text-indigo-300 truncate">0xe05fdb4e9b96386c4a1cb506b53c032ebe5a9f4a</div>
                    </Label>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy("0xe05fdb4e9b96386c4a1cb506b53c032ebe5a9f4a", "ERC20 address")}
                      className="text-indigo-400 hover:text-indigo-300"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2 border-2 border-cyan-500/30 rounded-md p-3 bg-cyan-900/20">
                    <RadioGroupItem value="ton" id="ton" />
                    <Label htmlFor="ton" className="flex-1">
                      <div className="font-medium text-cyan-400">USDT (TON)</div>
                      <div className="text-sm text-cyan-300 truncate">
                        UQCK6tTHarFlr3l1X71HMGRzJUJuvHTaGaAqncivV6GJQI4J
                      </div>
                    </Label>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy("UQCK6tTHarFlr3l1X71HMGRzJUJuvHTaGaAqncivV6GJQI4J", "TON address")}
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2 border-2 border-yellow-500/30 rounded-md p-3 bg-yellow-900/20">
                    <RadioGroupItem value="bep20" id="bep20" />
                    <Label htmlFor="bep20" className="flex-1">
                      <div className="font-medium text-yellow-400">USDT (BEP20)</div>
                      <div className="text-sm text-yellow-300 truncate">0xe05fdb4e9b96386c4a1cb506b53c032ebe5a9f4a</div>
                    </Label>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy("0xe05fdb4e9b96386c4a1cb506b53c032ebe5a9f4a", "BEP20 address")}
                      className="text-yellow-400 hover:text-yellow-300"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </RadioGroup>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center">
              <PaymentTimer duration={15 * 60} onExpire={handleTimerExpired} />
            </div>

            <div className="space-y-4">
              <div className="border-2 border-cyan-500/30 rounded-md p-4 space-y-2 bg-cyan-900/20">
                <div className="flex justify-between">
                  <span className="text-sm text-cyan-400 font-medium">Amount:</span>
                  <span className="font-bold text-cyan-300">₦{Number(formData.amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-cyan-400 font-medium">USD Equivalent:</span>
                  <span className="font-bold text-green-400">${calculateUsdAmount(formData.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-cyan-400 font-medium">Reference:</span>
                  <span className="font-bold text-purple-400">{formData.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-cyan-400 font-medium">Payment Method:</span>
                  <span className="font-bold text-orange-400 capitalize">
                    {formData.paymentMethod === "bank" ? "Bank Transfer" : "Cryptocurrency"}
                  </span>
                </div>
              </div>

              {formData.paymentMethod === "bank" && (
                <div className="border-2 border-green-500/30 rounded-md p-4 space-y-2 bg-green-900/20">
                  <div className="font-bold text-green-400">
                    {formData.bankAccount === "access" ? "ACCESS BANK" : "SMARTCASH PAYMENT SERVICE BANK"}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-300 font-medium">Account Number:</span>
                    <span className="font-bold text-green-400">
                      {formData.bankAccount === "access" ? "1907856695" : "8088578817"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-300 font-medium">Account Name:</span>
                    <span className="font-bold text-green-400">
                      {formData.bankAccount === "access" ? "EBUBECHUKWU IFEANYI ELIJAH" : "IFEANYI ONUOHA"}
                    </span>
                  </div>
                </div>
              )}

              {formData.paymentMethod === "crypto" && (
                <div className="border-2 border-purple-500/30 rounded-md p-4 space-y-2 bg-purple-900/20">
                  <div className="font-bold text-purple-400">USDT ({formData.cryptoNetwork?.toUpperCase()})</div>
                  <div className="break-all text-sm font-mono text-purple-300">
                    {formData.cryptoNetwork === "trc20" && "TV8rxyuDHeyrBGMzc8bvbrbfDTH4MMEmNh"}
                    {formData.cryptoNetwork === "erc20" && "0xe05fdb4e9b96386c4a1cb506b53c032ebe5a9f4a"}
                    {formData.cryptoNetwork === "ton" && "UQCK6tTHarFlr3l1X71HMGRzJUJuvHTaGaAqncivV6GJQI4J"}
                    {formData.cryptoNetwork === "bep20" && "0xe05fdb4e9b96386c4a1cb506b53c032ebe5a9f4a"}
                  </div>
                </div>
              )}

              {!timerExpired && (
                <div className="space-y-2">
                  <Label htmlFor="transactionId" className="text-lg font-semibold text-cyan-400">
                    Transaction ID / Reference
                  </Label>
                  <Input
                    id="transactionId"
                    name="transactionId"
                    className="border-2 border-cyan-500/30 focus:border-cyan-400 bg-slate-800/50 text-white"
                    placeholder="Enter your transaction ID or reference"
                    value={formData.transactionId}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-cyan-300">
                    Enter the transaction ID or reference from your bank transfer or cryptocurrency transaction
                  </p>
                </div>
              )}

              {timerExpired ? (
                <div className="flex items-center justify-center p-4 border-2 border-red-500/30 rounded-md bg-red-900/20 text-red-400">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Payment session expired. Please start again.</span>
                </div>
              ) : (
                <div className="flex items-center justify-center p-4 border-2 border-cyan-500/30 rounded-md bg-cyan-900/20">
                  <Clock className="h-5 w-5 mr-2 text-cyan-400" />
                  <span className="text-cyan-300 font-medium">Please complete your payment within the time limit</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between bg-slate-800/50 rounded-b-lg p-6">
        {!paymentStarted ? (
          <>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="border-2 border-gray-500/30 hover:border-gray-400/50 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={startPayment}
              disabled={!isOnline && !hasJavaScript}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold"
            >
              Proceed to Payment
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              disabled={verifying}
              className="border-2 border-gray-500/30 hover:border-gray-400/50 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={completePayment}
              disabled={timerExpired || verifying || !formData.transactionId}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold"
            >
              {verifying ? (
                <>
                  <AnimatedLoader size="sm" className="mr-2" /> Verifying Payment
                </>
              ) : (
                "Verify Payment"
              )}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
