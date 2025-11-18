import { useEffect, useState } from 'react'
import { getApiKey } from '../lib/api'

export default function SettingsBar() {
  const [apiKey, setApiKey] = useState('')
  const [agentName, setAgentName] = useState('Agent')
  const [agentEmail, setAgentEmail] = useState('agent@example.com')
  const [creating, setCreating] = useState(false)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

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
      const res = await fetch(`${baseUrl}/api/companies`, {
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

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-start md:items-center">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
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
      <div className="flex gap-2">
        <button onClick={save} className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white">Save</button>
        <button onClick={createCompany} disabled={creating} className="px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-60">{creating ? 'Creating...' : 'Create demo company'}</button>
      </div>
    </div>
  )
}
