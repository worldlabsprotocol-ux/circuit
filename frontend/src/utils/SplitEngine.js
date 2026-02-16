export function validateSplits(splits) {
  const total = splits.reduce((sum, s) => sum + s.percent, 0)
  return total === 100
}

export function lockSplits(splits) {
  return splits.map(s => ({ ...s, locked: true }))
}
