import { useEffect, useState } from 'react'

export default function TicketList({ onSelect }) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    const res = await fetch(`${baseUrl}/api/tickets`)
    const data = await res.json()
    setTickets(data.items || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">Recent Tickets</h3>
        <button onClick={load} className="text-xs text-blue-300 hover:text-blue-200">Refresh</button>
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
