import { useContext } from 'react'
import { TokenContext } from '../context/TokenContext'

export function useToken() {
  const ctx = useContext(TokenContext)

  if (!ctx) {
    throw new Error('Нет доступа к TokenContext')
  }

  return ctx
}
