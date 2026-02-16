import { useState, useEffect } from 'react'
import { load, save } from '../storage/useStorage'

export function useCredits(userId) {
  const [credits, setCredits] = useState(load('credits-'+userId, 5))
  const [yielded, setYielded] = useState(load('yield-'+userId, 0))

  useEffect(() => {
    save('credits-'+userId, credits)
    save('yield-'+userId, yielded)
  }, [credits, yielded])

  const earn = (n) => setCredits(c => c + n)
  const spend = (n) => setCredits(c => Math.max(0, c - n))
  const accrueYield = () => setYielded(y => y + Math.floor(credits * 0.01))

  return { credits, yielded, earn, spend, accrueYield }
}
