// Simulated exchange rate service
// In a real application, this would call an external API

export async function getExchangeRate(): Promise<number> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Base rate
  const baseRate = 1890

  // Add some random fluctuation to simulate real exchange rate changes
  // Fluctuate between -2% and +2% of the base rate
  const fluctuation = baseRate * (Math.random() * 0.04 - 0.02)

  // Return the rate rounded to 2 decimal places
  return Math.round((baseRate + fluctuation) * 100) / 100
}
