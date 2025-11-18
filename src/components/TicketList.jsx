import { useEffect, useState } from 'react'
import { getBaseUrl, authHeaders } from '../lib/api'

export default function TicketList({ onSelect }) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState([])

  const load = async () => {
    setLoading(true)
    const baseUrl = getBaseUrl()
    const qs = new URLSearchParams()
    if (status) qs.set('status', status)
    if (q) qs.set('q', q)
    const res = await fetch(`${baseUrl}/api/tickets?${qs.toString()}`, { headers: authHeaders() })
    const data = await res.json()
    setTickets(data.items || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [status])

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id])
  }

  const bulk = async (action, value=null) => {
    if (selected.length === 0) return
    await fetch(`${getBaseUrl()}/api/tickets/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ ids: selected, action, value })
    })
    setSelected([])
    load()
  }

  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3 gap-2">
        <h3 className="text-white font-semibold">Recent Tickets</h3>
        <div className="flex items-center gap-2">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search" className="text-xs bg-slate-900/70 text-slate-200 border border-slate-700 rounded px-2 py-1" />
          <button onClick={load} className="text-xs text-blue-300 hover:text-blue-200">Search</button>
          <select value={status} onChange={(e)=>setStatus(e.target.value)} className="text-xs bg-slate-900/70 text-slate-200 border border-slate-700 rounded px-2 py-1">
            <option value="">All</option>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
          </select>
          <button onClick={load} className="text-xs text-blue-300 hover:text-blue-200">Refresh</button>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-300">Bulk actions for {selected.length}:</span>
          <button onClick={()=>bulk('status','open')} className="px-2 py-1 rounded bg-slate-700 text-white">Mark Open</button>
          <button onClick={()=>bulk('status','pending')} className="px-2 py-1 rounded bg-slate-700 text-white">Mark Pending</button>
          <button onClick={()=>bulk('status','closed')} className="px-2 py-1 rounded bg-slate-700 text-white">Mark Closed</button>
          <button onClick={()=>bulk('priority','low')} className="px-2 py-1 rounded bg-slate-700 text-white">Priority Low</button>
          <button onClick={()=>bulk('priority','medium')} className="px-2 py-1 rounded bg-slate-700 text-white">Priority Medium</button>
          <button onClick={()=>bulk('priority','high')} className="px-2 py-1 rounded bg-slate-700 text-white">Priority High</button>
        </div>
      )}

      {loading ? (
        <p className="text-slate-400 text-sm">Loading...</p>
      ) : tickets.length === 0 ? (
        <p className="text-slate-400 text-sm">No tickets yet.</p>
      ) : (
        <ul className="divide-y divide-slate-700/60">
          {tickets.map(t => (
            <li key={t.id} className="py-3 flex items-start gap-3">
              <input type="checkbox" checked={selected.includes(t.id)} onChange={()=>toggleSelect(t.id)} className="mt-1" />
              <div className={`mt-1 h-2 w-2 rounded-full ${t.status === 'open' ? 'bg-green-400' : t.status === 'pending' ? 'bg-yellow-400' : 'bg-slate-400'}`}></div>
              <div className="min-w-0 cursor-pointer" onClick={() => onSelect && onSelect(t)}>
                <p className="text-white truncate">{t.subject}</p>
                <p className="text-xs text-slate-400 truncate">{t.submitter_name} • {t.submitter_email}</p>
              </div>
              <div className="ml-auto text-xs text-slate-400 flex items-center gap-2">
                <span>{t.priority}</span>
                {t.tags?.length ? (
                  <span className="text-slate-300">{t.tags.join(', ')}</span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
