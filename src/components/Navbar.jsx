import { Link } from 'react-router-dom'

export default function Navbar({ query, setQuery, wishCount }) {
  return (
    <header className="sticky top-0 z-40 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 grid place-items-center shadow-glow">
            <span className="text-ink-950 font-black">G</span>
          </span>
          <span>Gear<span className="text-brand-400">Garage</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 ml-4 text-sm text-zinc-400">
          <a className="hover:text-white transition" href="#">Shop</a>
          <a className="hover:text-white transition" href="#">Brands</a>
          <a className="hover:text-white transition" href="#">Deals</a>
          <a className="hover:text-white transition" href="#">Garage Services</a>
        </nav>

        <div className="flex-1 max-w-xl ml-auto relative">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search parts, brands, vehicle models..."
            className="w-full bg-ink-800/70 border border-ink-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-zinc-500 outline-none transition"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </div>

        <button className="relative p-2.5 rounded-lg hover:bg-ink-800 transition" aria-label="Wishlist">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {wishCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-brand-500 text-ink-950 text-[10px] font-bold rounded-full w-4 h-4 grid place-items-center">
              {wishCount}
            </span>
          )}
        </button>

        <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-ink-950 font-semibold text-sm transition">
          Sign in
        </button>
      </div>
    </header>
  )
}
