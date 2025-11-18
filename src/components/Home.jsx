export default function Home() {
  return (
    <div className="max-w-5xl mx-auto text-center mt-16">
      <h2 className="text-3xl md:text-4xl font-bold text-white">Modern support desk, ready to demo</h2>
      <p className="text-slate-300 mt-3">Sign up to instantly create your workspace and first admin. Then log in to manage tickets, search, tag, and run bulk actions.</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Feature title="SaaS-style signup" desc="Create a company and admin in one step. No API key required." />
        <Feature title="Secure sessions" desc="Password-based login with HttpOnly cookie and Bearer token support." />
        <Feature title="Powerful ticketing" desc="Full-text search, tags, priorities, and bulk updates." />
      </div>
      <p className="text-slate-400 text-sm mt-8">Use the bar above to sign up and log in.</p>
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
