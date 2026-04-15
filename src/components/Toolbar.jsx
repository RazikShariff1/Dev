export default function Toolbar({ total, vehicle, setVehicle, vehicleTypes, sort, setSort }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Catalogue</h2>
        <p className="text-sm text-zinc-500 mt-1">{total} parts available</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="inline-flex bg-ink-800/60 border border-ink-700 rounded-xl p-1">
          {vehicleTypes.map(v => (
            <button
              key={v}
              onClick={() => setVehicle(v)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                vehicle === v ? 'bg-brand-500 text-ink-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="relative">
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="appearance-none bg-ink-800/60 border border-ink-700 rounded-xl pl-4 pr-10 py-2 text-sm font-medium focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none cursor-pointer"
          >
            <option value="popular">Most popular</option>
            <option value="rating">Top rated</option>
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>
    </div>
  )
}
