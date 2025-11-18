export function getBaseUrl() {
  return import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
}

export function getApiKey() {
  // Priority: localStorage override, then env
  const ls = typeof window !== 'undefined' ? window.localStorage.getItem('apiKey') : null
  return ls || import.meta.env.VITE_API_KEY || ''
}

export function authHeaders(extra = {}) {
  const key = getApiKey()
  return key
    ? { 'X-API-Key': key, ...extra }
    : { ...extra }
}
