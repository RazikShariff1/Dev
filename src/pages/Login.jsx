import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth, DEMO_CREDS } from '../store/auth'

export default function Login() {
  const { login, isAuthed } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/admin'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  if (isAuthed) return <Navigate to={from} replace />

  const submit = (e) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    const result = login(username.trim(), password)
    setBusy(false)
    if (result.ok) navigate(from, { replace: true })
    else setError(result.error)
  }

  const fillDemo = () => {
    setUsername(DEMO_CREDS.username)
    setPassword(DEMO_CREDS.password)
    setError(null)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 grid place-items-center shadow-glow">
              <span className="text-ink-950 font-black">G</span>
            </span>
            <span>Gear<span className="text-brand-400">Garage</span></span>
          </Link>
        </div>
      </header>

      <main className="flex-1 grid place-items-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="glass rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/40 grid place-items-center text-brand-300">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <div>
                <h1 className="font-display text-2xl font-bold">Admin login</h1>
                <p className="text-sm text-zinc-500">Sign in to manage inventory.</p>
              </div>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <label className="block">
                <span className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5">Username</span>
                <input
                  autoFocus
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-ink-800/70 border border-ink-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-lg px-3 py-2 text-sm outline-none transition"
                />
              </label>

              <label className="block">
                <span className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5">Password</span>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-ink-800/70 border border-ink-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-lg px-3 py-2 pr-20 text-sm outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(s => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white px-2 py-1 rounded"
                  >
                    {showPw ? 'Hide' : 'Show'}
                  </button>
                </div>
              </label>

              {error && (
                <div className="text-sm px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-60 text-ink-950 font-semibold transition shadow-glow"
              >
                {busy ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-ink-800 flex items-center justify-between gap-3">
              <div className="text-xs text-zinc-500">
                Demo: <code className="text-zinc-300">{DEMO_CREDS.username}</code> / <code className="text-zinc-300">{DEMO_CREDS.password}</code>
              </div>
              <button
                type="button"
                onClick={fillDemo}
                className="text-xs px-2.5 py-1 rounded-md border border-ink-700 hover:border-brand-500 hover:text-brand-300 transition"
              >
                Use demo
              </button>
            </div>
          </div>

          <div className="text-center mt-5">
            <Link to="/" className="text-sm text-zinc-500 hover:text-zinc-300 transition">← Back to store</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
