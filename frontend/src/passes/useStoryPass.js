import { load, save } from '../storage/useStorage'

export function useStoryPass(userId, storyId) {
  const owns = load('pass-'+userId+'-'+storyId, false)
  const mint = () => save('pass-'+userId+'-'+storyId, true)
  return { owns, mint }
}
