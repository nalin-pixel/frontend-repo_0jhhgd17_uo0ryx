import { useEffect, useState } from 'react'
import { getBaseUrl, setSession, clearSession, authHeaders } from '../lib/api'

export default function SettingsBar() {
  const [agentName, setAgentName] = useState('Agent')
  const [agentEmail, setAgentEmail] = useState('agent@example.com')
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('password123')
  const [companyName, setCompanyName] = useState('Demo Company')

  useEffect(() => {
    const n = localStorage.getItem('agentName')
    const e = localStorage.getItem('agentEmail')
    if (n) setAgentName(n)
    if (e) setAgentEmail(e)
  }, [])

  const save = () => {
    localStorage.setItem('agentName', agentName)
    localStorage.setItem('agentEmail', agentEmail)
    alert('Saved settings locally')
  }

  const signup = async () => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_name: companyName, name: 'Admin', email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Signup failed')
      alert('Company created. Now log in with your email and password.')
    } catch (e) {
      alert(e.message)
    }
  }

  const login = async () => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
        <label className="text-sm text-slate-300 flex items-center gap-2">
          <span className="min-w-[100px]">Company</span>
          <input className="flex-1 rounded-md bg-slate-900/60 border border-slate-700 text-white px-3 py-2" value={companyName} onChange={e=>setCompanyName(e.target.value)} placeholder="Your company" />
        </label>
        <label className="text-sm text-slate-300 flex items-center gap-2">
          <span className="min-w-[80px]">Agent</span>
          <input className="flex-1 rounded-md bg-slate-900/60 border border-slate-700 text-white px-3 py-2" value={agentName} onChange={e=>setAgentName(e.target.value)} />
        </label>
        <label className="text-sm text-slate-300 flex items-center gap-2">
          <span className="min-w-[80px]">Email</span>
          <input className="flex-1 rounded-md bg-slate-900/60 border border-slate-700 text-white px-3 py-2" value={agentEmail} onChange={e=>setAgentEmail(e.target.value)} />
        </label>
        <div className="text-sm text-slate-300 flex items-center gap-2">
          <button onClick={save} className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white">Save</button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="user email" className="rounded-md bg-slate-900/60 border border-slate-700 text-white px-3 py-2 text-sm" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" type="password" className="rounded-md bg-slate-900/60 border border-slate-700 text-white px-3 py-2 text-sm" />
        <button onClick={signup} className="px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white">Sign up</button>
        <button onClick={login} className="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white">Login</button>
        <button onClick={logout} className="px-3 py-2 rounded-md bg-slate-600 hover:bg-slate-500 text-white">Logout</button>
      </div>
    </div>
  )
}
