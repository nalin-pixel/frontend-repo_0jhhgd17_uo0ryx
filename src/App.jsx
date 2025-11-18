import { useEffect, useState, useMemo } from 'react'
import TicketForm from './components/TicketForm'
import TicketList from './components/TicketList'
import TicketDetail from './components/TicketDetail'
import { getBaseUrl, authHeaders, getSession, clearSession } from './lib/api'
import { Link } from 'react-router-dom'

function App() {
  const [selected, setSelected] = useState(null)
  const [createdId, setCreatedId] = useState(null)
  const [me, setMe] = useState(null)

  const session = useMemo(() => getSession(), [typeof window !== 'undefined' ? window.localStorage.getItem('session') : null])

  const loadMe = async () => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/auth/me`, { headers: authHeaders() })
      if (res.ok) setMe(await res.json())
      else setMe(null)
    } catch {
      setMe(null)
    }
  }

  useEffect(() => {
    loadMe()
    const onStorage = (e) => {
      if (e.key === 'session') {
        loadMe()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const logout = async () => {
    try { await fetch(`${getBaseUrl()}/api/auth/logout`, { method: 'POST', headers: authHeaders() }) } catch {}
    clearSession()
    await loadMe()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen p-8">
        <header className="max-w-5xl mx-auto mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/flame-icon.svg" alt="Flames" className="w-10 h-10" />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Ticket Desk</h1>
              <p className="text-blue-200/80 text-sm">Simple SaaS-style signup & session auth</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/test" className="text-sm text-blue-300 hover:text-blue-200">Connection test</a>
            {!me ? (
              <div className="flex items-center gap-2">
                <Link to="/auth" className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm">Sign in</Link>
                <Link to="/auth" className="px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-sm">Create workspace</Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-white text-sm leading-tight">{me.name || 'User'}</p>
                  <p className="text-blue-200/80 text-xs leading-tight">{me.email}</p>
                </div>
                <button onClick={logout} className="px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-white text-sm">Logout</button>
              </div>
            )}
          </div>
        </header>

        {!me ? (
          <HomeHero />
        ) : (
          <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 shadow-xl">
              <h2 className="text-white font-semibold mb-4">Submit a ticket</h2>
              <TicketForm onCreated={(id)=> setCreatedId(id)} />
              {createdId && (
                <p className="text-green-400 text-sm mt-4">Ticket created with id {createdId}</p>
              )}
            </section>
            <aside>
              <TicketList onSelect={setSelected} />
            </aside>
          </main>
        )}
      </div>

      {selected && (
        <TicketDetail ticket={selected} onClose={()=>setSelected(null)} />
      )}
    </div>
  )
}

function HomeHero() {
  return (
    <div className="max-w-5xl mx-auto text-center mt-16">
      <h2 className="text-3xl md:text-4xl font-bold text-white">Modern support desk, ready to demo</h2>
      <p className="text-slate-300 mt-3">Create your workspace and first admin, then log in to manage tickets, search, tag, and run bulk actions.</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Feature title="SaaS-style signup" desc="Create a company and admin in one step. No API key required." />
        <Feature title="Secure sessions" desc="Password-based login with HttpOnly cookie and Bearer token support." />
        <Feature title="Powerful ticketing" desc="Full-text search, tags, priorities, and bulk updates." />
      </div>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Link to="/auth" className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white">Create workspace</Link>
        <Link to="/auth" className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white">Sign in</Link>
      </div>
    </div>
  )
}

function Feature({ title, desc }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-left">
      <h3 className="text-white font-semibold">{title}</h3>
      <p className="text-slate-300 text-sm mt-1">{desc}</p>
    </div>
  )
}

export default App
