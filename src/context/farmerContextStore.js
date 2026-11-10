import { createContext, useContext } from 'react'

export const FarmerContext = createContext(null)

/**
 * Access farmer portal listings, offers, orders, notifications, and mutations.
 */
export function useFarmer() {
  const ctx = useContext(FarmerContext)
  if (!ctx) {
    throw new Error('useFarmer must be used inside a FarmerProvider')
  }
  return ctx
}

