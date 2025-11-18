import { useState, useEffect } from 'react'
import { getBaseUrl, getApiKey, authHeaders } from '../lib/api'

export default function TicketForm({ onCreated }) {
  const [form, setForm] = useState({
    submitter_name: '',
    submitter_email: '',
    subject: '',
    message: '',
    priority: 'medium'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const baseUrl = getBaseUrl()
      const res = await fetch(`${baseUrl}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Failed to create ticket. Ensure API key is set in header settings above.')
      const data = await res.json()
      setSuccess('Ticket submitted successfully')
      setForm({ submitter_name: '', submitter_email: '', subject: '', message: '', priority: 'medium' })
      onCreated && onCreated(data.id)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-300 mb-1">Your name</label>
          <input name="submitter_name" value={form.submitter_name} onChange={handleChange} required className="w-full rounded-md bg-slate-800/60 border border-slate-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm text-slate-300 mb-1">Your email</label>
          <input type="email" name="submitter_email" value={form.submitter_email} onChange={handleChange} required className="w-full rounded-md bg-slate-800/60 border border-slate-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm text-slate-300 mb-1">Subject</label>
          <input name="subject" value={form.subject} onChange={handleChange} required className="w-full rounded-md bg-slate-800/60 border border-slate-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm text-slate-300 mb-1">Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange} className="w-full rounded-md bg-slate-800/60 border border-slate-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-1">Message</label>
        <textarea name="message" value={form.message} onChange={handleChange} required rows={5} className="w-full rounded-md bg-slate-800/60 border border-slate-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {success && <p className="text-green-400 text-sm">{success}</p>}

      <button disabled={loading} className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium disabled:opacity-60">
        {loading ? 'Submitting...' : 'Submit Ticket'}
      </button>
    </form>
  )
}
