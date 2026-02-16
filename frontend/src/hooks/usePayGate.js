import { useState, useEffect } from 'react'

const KEY = 'wl_paid'

export function usePayGate() {
  const [paid, setPaid] = useState(false)

  useEffect(() => {
    setPaid(localStorage.getItem(KEY) === 'true')
  }, [])

  const unlock = () => {
    localStorage.setItem(KEY, 'true')
    setPaid(true)
  }

  return { paid, unlock }
}
