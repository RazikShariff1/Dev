export default function Footer() {
  return (
    <footer className="border-t border-ink-800 bg-ink-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 grid place-items-center">
              <span className="text-ink-950 font-black">G</span>
            </span>
            <span>Gear<span className="text-brand-400">Garage</span></span>
          </div>
          <p className="mt-3 text-sm text-zinc-500 max-w-xs">
            Premium auto & moto parts for enthusiasts. Since 2019.
          </p>
        </div>
        {[
          ['Shop', ['Cars', 'Bikes', 'Brands', 'Deals']],
          ['Support', ['Fitment Help', 'Returns', 'Warranty', 'Contact']],
          ['Garage', ['About', 'Blog', 'Careers', 'Press']],
        ].map(([title, items]) => (
          <div key={title}>
            <div className="font-semibold mb-3">{title}</div>
            <ul className="space-y-2 text-sm text-zinc-400">
              {items.map(i => (
                <li key={i}><a href="#" className="hover:text-brand-400 transition">{i}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-zinc-500">
          <div>© {new Date().getFullYear()} GearGarage. Built for speed.</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Cookies</a>
            <a href="/admin" className="hover:text-brand-400 transition">Admin</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
