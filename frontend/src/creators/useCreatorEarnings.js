import { load, save } from '../storage/useStorage'

export function useCreatorEarnings(creatorId) {
  const state = load('creator-'+creatorId, { earnings: 0, reads: 0 })

  const earn = (n) => {
    state.earnings += n
    save('creator-'+creatorId, state)
  }

  const read = () => {
    state.reads += 1
    save('creator-'+creatorId, state)
  }

  return state
}
