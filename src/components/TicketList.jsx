import { useEffect, useState } from 'react'
import { getBaseUrl, authHeaders } from '../lib/api'

export default function TicketList({ onSelect }) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')

  const load = async () => {
    setLoading(true)
    const baseUrl = getBaseUrl()
    const qs = new URLSearchParams()
    if (status) qs.set('status', status)
    const res = await fetch(`${baseUrl}/api/tickets?${qs.toString()}`, { headers: authHeaders() })
    const data = await res.json()
    setTickets(data.items || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [status])

  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">Recent Tickets</h3>
        <div className="flex items-center gap-2">
          <select value={status} onChange={(e)=>setStatus(e.target.value)} className="text-xs bg-slate-900/70 text-slate-200 border border-slate-700 rounded px-2 py-1">
            <option value="">All</option>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
          </select>
          <button onClick={load} className="text-xs text-blue-300 hover:text-blue-200">Refresh</button>
        </div>
      </div>
      {loading ? (
        <p className="text-slate-400 text-sm">Loading...</p>
      ) : tickets.length === 0 ? (
        <p className="text-slate-400 text-sm">No tickets yet.</p>
      ) : (
        <ul className="divide-y divide-slate-700/60">
          {tickets.map(t => (
            <li key={t.id} className="py-3 flex items-start gap-3 cursor-pointer" onClick={() => onSelect && onSelect(t)}>
              <div className={`mt-1 h-2 w-2 rounded-full ${t.status === 'open' ? 'bg-green-400' : t.status === 'pending' ? 'bg-yellow-400' : 'bg-slate-400'}`}></div>
              <div className="min-w-0">
                <p className="text-white truncate">{t.subject}</p>
                <p className="text-xs text-slate-400 truncate">{t.submitter_name} • {t.submitter_email}</p>
              </div>
              <div className="ml-auto text-xs text-slate-400">{t.priority}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
