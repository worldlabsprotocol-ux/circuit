export function encodeSession(state, creator, parent = null) {
  const payload = { state, creator, parent }
  const json = JSON.stringify(payload)
  return btoa(json)
}

export function decodeSession(encoded) {
  try {
    const json = atob(encoded)
    return JSON.parse(json)
  } catch {
    return null
  }
}
