export const createMidiClip = () => ({
  id: crypto.randomUUID(),
  type: "midi",
  startTime: 0,
  length: 4,
  loopLength: 4,
  notes: [],
  automation: []
})
