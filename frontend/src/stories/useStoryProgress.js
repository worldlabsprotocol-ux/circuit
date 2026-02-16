import { load, save } from '../storage/useStorage'

export function loadProgress(userId, storyId) {
  return load('progress-'+userId+'-'+storyId, {
    chapter: 'c1',
    completed: false,
    endings: []
  })
}

export function saveProgress(userId, storyId, data) {
  save('progress-'+userId+'-'+storyId, data)
}
