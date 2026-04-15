export default function CategoryBar({ categories, active, onChange }) {
  return (
    <div className="sticky top-16 z-30 glass border-b border-ink-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-2 overflow-x-auto scrollbar-none">
        {categories.map(c => {
          const isActive = active === c.id
          return (
            <button
              key={c.id}
              onClick={() => onChange(c.id)}
              className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition border ${
                isActive
                  ? 'bg-brand-500 text-ink-950 border-brand-500 shadow-glow'
                  : 'bg-ink-800/50 text-zinc-300 border-ink-700 hover:border-brand-500/50 hover:text-white'
              }`}
            >
              <span className={isActive ? 'text-ink-950' : 'text-brand-400'}>{c.icon}</span>
              {c.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
