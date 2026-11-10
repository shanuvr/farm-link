import { createContext, useContext } from 'react'

export const CompanyContext = createContext(null)

/**
 * Access unified company procurement state, farmer directory, and cross-portal actions.
 */
export function useCompany() {
  const ctx = useContext(CompanyContext)
  if (!ctx) {
    throw new Error('useCompany must be used inside a CompanyProvider')
  }
  return ctx
}

