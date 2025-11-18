export function getBaseUrl() {
  return import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
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
  const sid = getSession()
  const headers = { ...extra }
  if (sid) headers['Authorization'] = `Bearer ${sid}`
  return headers
}