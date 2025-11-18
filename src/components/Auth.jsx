import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBaseUrl, setSession } from '../lib/api'

export default function Auth() {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const navigate = useNavigate()

  // Shared
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('password123')

  // Signup specific
  const [companyName, setCompanyName] = useState('Demo Company')
  const [name, setName] = useState('Admin')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const signup = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    try {
      const res = await fetch(`${getBaseUrl()}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_name: companyName, name, email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Signup failed')
      setMsg('Company created. You can now sign in with your email and password.')
      setMode('signin')
    } catch (e) {
      setMsg(e.message)
    } finally {
      setLoading(false)
    }
  }

  const signin = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    try {
      const res = await fetch(`${getBaseUrl()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Login failed')
      if (data.session) setSession(data.session)
      navigate('/')
    } catch (e) {
      setMsg(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-md mx-auto mt-16 bg-slate-800/60 border border-slate-700 rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src="/flame-icon.svg" alt="Flames" className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Ticket Desk</h1>
              <p className="text-blue-200/80 text-xs">Sign in or create your workspace</p>
            </div>
          </div>
          <button onClick={()=>navigate('/')} className="text-sm text-blue-300 hover:text-blue-200">Home</button>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={()=>setMode('signin')} className={`flex-1 px-3 py-2 rounded-md text-sm ${mode==='signin'?'bg-blue-600 text-white':'bg-slate-900/50 text-slate-300 border border-slate-700'}`}>Sign in</button>
          <button onClick={()=>setMode('signup')} className={`flex-1 px-3 py-2 rounded-md text-sm ${mode==='signup'?'bg-emerald-600 text-white':'bg-slate-900/50 text-slate-300 border border-slate-700'}`}>Sign up</button>
        </div>

        {mode === 'signup' ? (
          <form onSubmit={signup} className="space-y-3">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Company name</label>
              <input value={companyName} onChange={e=>setCompanyName(e.target.value)} className="w-full rounded-md bg-slate-900/60 border border-slate-700 text-white px-3 py-2" placeholder="Your company" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Your name</label>
              <input value={name} onChange={e=>setName(e.target.value)} className="w-full rounded-md bg-slate-900/60 border border-slate-700 text-white px-3 py-2" placeholder="Full name" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-md bg-slate-900/60 border border-slate-700 text-white px-3 py-2" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded-md bg-slate-900/60 border border-slate-700 text-white px-3 py-2" placeholder="••••••••" />
            </div>
            {msg && <p className={`text-sm ${msg.toLowerCase().includes('created')?'text-emerald-400':'text-red-400'}`}>{msg}</p>}
            <button type="submit" disabled={loading} className="w-full px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white">
              {loading ? 'Creating...' : 'Create workspace'}
            </button>
          </form>
        ) : (
          <form onSubmit={signin} className="space-y-3">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-md bg-slate-900/60 border border-slate-700 text-white px-3 py-2" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded-md bg-slate-900/60 border border-slate-700 text-white px-3 py-2" placeholder="••••••••" />
            </div>
            {msg && <p className="text-sm text-red-400">{msg}</p>}
            <button type="submit" disabled={loading} className="w-full px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        )}

        <p className="text-xs text-slate-400 mt-6">
          Sessions are stored with an HTTP-only cookie and a short token saved locally to authorize API requests.
        </p>
      </div>
    </div>
  )
}
