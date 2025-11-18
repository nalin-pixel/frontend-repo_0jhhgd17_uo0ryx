import { useEffect, useState } from 'react'
import { getBaseUrl, authHeaders } from '../lib/api'

export default function TicketDetail({ ticket, onClose }) {
  const [detail, setDetail] = useState(ticket)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const load = async () => {
      const baseUrl = getBaseUrl()
      const res = await fetch(`${baseUrl}/api/tickets/${ticket.id}`, { headers: authHeaders() })
      if (res.ok) {
        const data = await res.json()
        setDetail(data)
      }
    }
    if (ticket?.id) load()
  }, [ticket])

  const sendReply = async () => {
    if (!reply.trim()) return
    setSending(true)
    try {
      const baseUrl = getBaseUrl()
      const agentName = localStorage.getItem('agentName') || 'Agent'
      const agentEmail = localStorage.getItem('agentEmail') || 'agent@company.com'
      const res = await fetch(`${baseUrl}/api/tickets/${ticket.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ author_name: agentName, author_email: agentEmail, body: reply, send_email: true })
      })
      if (res.ok) {
        setReply('')
        const r = await fetch(`${baseUrl}/api/tickets/${ticket.id}`, { headers: authHeaders() })
        setDetail(await r.json())
      }
    } finally {
      setSending(false)
    }
  }

  const setStatus = async (status) => {
    const baseUrl = getBaseUrl()
    await fetch(`${baseUrl}/api/tickets/${ticket.id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ status }) })
    const r = await fetch(`${baseUrl}/api/tickets/${ticket.id}`, { headers: authHeaders() })
    setDetail(await r.json())
  }

  if (!detail) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white text-xl font-semibold">{detail.subject}</h3>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs ${detail.status === 'open' ? 'bg-green-600/30 text-green-300' : detail.status === 'pending' ? 'bg-yellow-600/30 text-yellow-300' : 'bg-slate-600/30 text-slate-300'}`}>{detail.status}</span>
                <select value={detail.status} onChange={(e)=>setStatus(e.target.value)} className="text-xs bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-1">
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-4">From {detail.submitter_name} • {detail.submitter_email}</p>
            <div className="space-y-3 max-h-72 overflow-auto pr-2">
              {detail.messages?.map((m, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                  <p className="text-slate-300 text-sm whitespace-pre-wrap">{m.body}</p>
                  <p className="text-xs text-slate-500 mt-1">— {m.author_name} • {new Date(m.created_at).toLocaleString()} • via {m.via}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <textarea value={reply} onChange={(e)=>setReply(e.target.value)} rows={3} placeholder="Type a reply..." className="w-full rounded-md bg-slate-800/60 border border-slate-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="mt-2 flex justify-end gap-2">
                <button onClick={onClose} className="px-3 py-2 text-slate-300 hover:text-white">Close</button>
                <button disabled={sending} onClick={sendReply} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-60">{sending ? 'Sending...' : 'Send reply via email'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
