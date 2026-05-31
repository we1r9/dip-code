import { createContext, useState } from 'react'
import type { ReactNode } from 'react'

interface TokenContextValue {
  token: string
  setToken: (token: string) => void
}

const TokenContext = createContext<TokenContextValue | null>(null)

const TOKEN_KEY = 'access_token'

export function TokenProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState(() => sessionStorage.getItem(TOKEN_KEY) ?? '')

  function setToken(value: string) {
    sessionStorage.setItem(TOKEN_KEY, value)
    setTokenState(value)
  }

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  )
}

export { TokenContext }
