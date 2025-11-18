export function getBaseUrl() {
  return import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
}

export function getApiKey() {
  const ls = typeof window !== 'undefined' ? window.localStorage.getItem('apiKey') : null
  return ls || import.meta.env.VITE_API_KEY || ''
}

export function getSession() {
  return typeof window !== 'undefined' ? window.localStorage.getItem('session') : null
}

export function setSession(sid) {
  if (typeof window !== 'undefined') window.localStorage.setItem('session', sid)
}

export function clearSession() {
  if (typeof window !== 'undefined') window.localStorage.removeItem('session')
}

export function authHeaders(extra = {}) {
  const key = getApiKey()
  const sid = getSession()
  const headers = { ...extra }
  if (key) headers['X-API-Key'] = key
  if (sid) headers['Authorization'] = `Bearer ${sid}`
  return headers
}
