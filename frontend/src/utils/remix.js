export function applyRemix({
  currentTracks,
  incomingTracks,
  originalCreator,
  setTracks,
  setRoyaltySplit
}) {
  if (!incomingTracks) return

  // Replace tracks with incoming
  setTracks(incomingTracks)

  // Add 20% perpetual royalty to original creator
  setRoyaltySplit(prev => ({
    ...prev,
    originalCreator,
    originalShare: 20
  }))
}
