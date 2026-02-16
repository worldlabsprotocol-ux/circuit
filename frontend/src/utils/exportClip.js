export function exportClip(clip) {
  const blob = new Blob([JSON.stringify(clip, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = clip.name + '.json'
  a.click()
}
