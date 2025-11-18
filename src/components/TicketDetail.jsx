import { useEffect, useState } from 'react'

export default function TicketDetail({ ticket, onClose }) {
  const [detail, setDetail] = useState(ticket)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const load = async () => {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${baseUrl}/api/tickets/${ticket.id}`)
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
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${baseUrl}/api/tickets/${ticket.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author_name: 'Agent', author_email: 'agent@company.com', body: reply, send_email: true })
      })
      if (res.ok) {
        setReply('')
        // reload detail
        const r = await fetch(`${baseUrl}/api/tickets/${ticket.id}`)
        setDetail(await r.json())
      }
    } finally {
      setSending(false)
    }
  }

  if (!detail) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-white text-xl font-semibold mb-1">{detail.subject}</h3>
            <p className="text-slate-400 text-sm mb-4">From {detail.submitter_name} • {detail.submitter_email}</p>
            <div className="space-y-3 max-h-72 overflow-auto pr-2">
              {detail.messages?.map((m, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                  <p className="text-slate-300 text-sm whitespace-pre-wrap">{m.body}</p>
                  <p className="text-xs text-slate-500 mt-1">— {m.author_name} • {new Date(m.created_at).toLocaleString()}</p>
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
