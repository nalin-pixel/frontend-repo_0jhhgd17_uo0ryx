import { useState } from 'react'
import TicketForm from './components/TicketForm'
import TicketList from './components/TicketList'
import TicketDetail from './components/TicketDetail'
import SettingsBar from './components/SettingsBar'

function App() {
  const [selected, setSelected] = useState(null)
  const [createdId, setCreatedId] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen p-8">
        <header className="max-w-5xl mx-auto mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/flame-icon.svg" alt="Flames" className="w-10 h-10" />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Ticket Desk</h1>
              <p className="text-blue-200/80 text-sm">Multi-tenant support with email replies</p>
            </div>
          </div>
          <a href="/test" className="text-sm text-blue-300 hover:text-blue-200">Connection test</a>
        </header>

        <div className="max-w-5xl mx-auto mb-6">
          <SettingsBar />
        </div>

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
      </div>

      {selected && (
        <TicketDetail ticket={selected} onClose={()=>setSelected(null)} />
      )}
    </div>
  )
}

export default App
