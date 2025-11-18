import { useEffect, useState } from 'react'
import { getApiKey, getBaseUrl, setSession, clearSession, authHeaders } from '../lib/api'

export default function SettingsBar() {
  const [apiKey, setApiKey] = useState('')
  const [agentName, setAgentName] = useState('Agent')
  const [agentEmail, setAgentEmail] = useState('agent@example.com')
  const [creating, setCreating] = useState(false)
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('password123')
  const [role, setRole] = useState('admin')

  useEffect(() => {
    const key = getApiKey()
    if (key) setApiKey(key)
    const n = localStorage.getItem('agentName')
    const e = localStorage.getItem('agentEmail')
    if (n) setAgentName(n)
    if (e) setAgentEmail(e)
  }, [])

  const save = () => {
    if (apiKey) localStorage.setItem('apiKey', apiKey)
    localStorage.setItem('agentName', agentName)
    localStorage.setItem('agentEmail', agentEmail)
    alert('Saved settings locally')
  }

  const createCompany = async () => {
    setCreating(true)
    try {
      const rand = Math.random().toString(36).slice(2, 10)
      const newKey = `key_${rand}`
      const res = await fetch(`${getBaseUrl()}/api/companies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Demo Company', api_key: newKey })
      })
      if (!res.ok) throw new Error('Failed to create company')
      localStorage.setItem('apiKey', newKey)
      setApiKey(newKey)
      alert('Created demo company and saved API key')
    } catch (e) {
      alert(e.message)
    } finally {
      setCreating(false)
    }
  }

  const bootstrapAdmin = async () => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/auth/bootstrap_admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ name: 'Admin', email, password, role: 'admin' })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to bootstrap admin')
      alert('Admin created for this company. You can now log in.')
    } catch (e) {
      alert(e.message)
    }
  }

  const login = async () => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Login failed')
      setSession(data.session)
      alert('Logged in')
    } catch (e) {
      alert(e.message)
    }
  }

  const logout = async () => {
    try {
      await fetch(`${getBaseUrl()}/api/auth/logout`, { method: 'POST', headers: authHeaders() })
    } catch {}
    clearSession()
    alert('Logged out')
  }

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex flex-col gap-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
        <label className="text-sm text-slate-300 flex items-center gap-2">
          <span className="min-w-[80px]">API Key</span>
          <input className="flex-1 rounded-md bg-slate-900/60 border border-slate-700 text-white px-3 py-2" value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="Set your X-API-Key" />
        </label>
        <label className="text-sm text-slate-300 flex items-center gap-2">
          <span className="min-w-[80px]">Agent</span>
          <input className="flex-1 rounded-md bg-slate-900/60 border border-slate-700 text-white px-3 py-2" value={agentName} onChange={e=>setAgentName(e.target.value)} />
        </label>
        <label className="text-sm text-slate-300 flex items-center gap-2">
          <span className="min-w-[80px]">Email</span>
          <input className="flex-1 rounded-md bg-slate-900/60 border border-slate-700 text-white px-3 py-2" value={agentEmail} onChange={e=>setAgentEmail(e.target.value)} />
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={save} className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white">Save</button>
        <button onClick={createCompany} disabled={creating} className="px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-60">{creating ? 'Creating...' : 'Create demo company'}</button>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="user email" className="rounded-md bg-slate-900/60 border border-slate-700 text-white px-3 py-2 text-sm" />
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" type="password" className="rounded-md bg-slate-900/60 border border-slate-700 text-white px-3 py-2 text-sm" />
          <button onClick={bootstrapAdmin} className="px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white">Bootstrap admin</button>
          <button onClick={login} className="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white">Login</button>
          <button onClick={logout} className="px-3 py-2 rounded-md bg-slate-600 hover:bg-slate-500 text-white">Logout</button>
        </div>
      </div>
    </div>
  )
}
