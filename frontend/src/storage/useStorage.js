export function load(key, fallback) {
  const raw = localStorage.getItem(key)
  return raw ? JSON.parse(raw) : fallback
}

export function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}
