export type PaymentMethod = "bank" | "crypto"
export type BankAccount = "access" | "smartcash"
export type CryptoNetwork = "trc20" | "erc20" | "ton" | "bep20"
export type PaymentStatus = "pending" | "completed" | "failed"

export interface PaymentDetails {
  id: string
  amount: string
  email: string
  name: string
  reference: string
  transactionId?: string
  paymentMethod: PaymentMethod
  bankAccount?: BankAccount
  cryptoNetwork?: CryptoNetwork
  status: PaymentStatus
  date: string
  exchangeRate?: number
}
