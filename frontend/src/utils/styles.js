export const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(16, 1fr)',
  gap: 6,
}

export const cellStyle = (v) => ({
  height: 28,
  background: v ? '#4caf50' : '#222',
  borderRadius: 4,
  touchAction: 'manipulation',
})
