import { TRIBE_MODE } from './config'

export function tribeRespond({ view, input }) {
  // Base Tribe always works
  if (TRIBE_MODE !== 'enhanced') {
    return baseReply(view)
  }

  // Enhanced Tribe (stubbed)
  return "Enhanced Tribe is coming soon, tribe. Unlock with $SKR to go deeper."
}

function baseReply(view) {
  if (view === 'edit') {
    return "Execute the next bar, tribe. Momentum matters."
  }
  if (view === 'takes') {
    return "Strong takes build reputation. Capture intent, not perfection."
  }
  if (view === 'pay') {
    return "Sound turns into value here. Move when it feels right."
  }
  return "Stay focused, tribe. Execution over effort."
}
