import { createContext, useState } from 'react'
import type { ReactNode } from 'react'

interface TokenContextValue {
  token: string
  setToken: (token: string) => void
}

const TokenContext = createContext<TokenContextValue | null>(null)

export function TokenProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState('')

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  )
}

export { TokenContext }
