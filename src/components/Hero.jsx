export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-ink-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
        <div className="animate-fadeUp">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-medium mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
            Fresh stock just dropped
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight">
            Parts built for<br />
            <span className="bg-gradient-to-r from-brand-300 via-brand-400 to-brand-600 bg-clip-text text-transparent">
              the obsessed.
            </span>
          </h1>
          <p className="mt-5 text-zinc-400 text-lg max-w-lg">
            Hand-picked performance parts for your car and bike. OEM-grade quality,
            motorsport-grade soul — all in one garage.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="px-5 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-ink-950 font-semibold transition shadow-glow">
              Browse Catalogue
            </button>
            <button className="px-5 py-3 rounded-xl border border-ink-700 hover:border-brand-500 hover:bg-ink-800 font-medium transition">
              Find by Vehicle →
            </button>
          </div>
          <div className="mt-10 flex gap-8">
            {[
              ['500+', 'SKUs in stock'],
              ['120+', 'Global brands'],
              ['48hr', 'Express delivery'],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="font-display text-2xl font-bold">{k}</div>
                <div className="text-xs uppercase tracking-wider text-zinc-500">{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative animate-fadeUp" style={{ animationDelay: '120ms' }}>
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/20 via-transparent to-transparent blur-3xl" />
          <div className="relative glass rounded-3xl p-6 md:p-8">
            <img
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=80"
              alt="Featured part"
              className="w-full h-80 object-cover rounded-2xl"
              loading="lazy"
            />
            <div className="mt-5 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-brand-400 font-semibold">Featured</div>
                <div className="font-display font-semibold text-lg mt-1">Track-Ready Upgrade Bundle</div>
                <div className="text-sm text-zinc-400">Brakes · Suspension · Intake</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-zinc-500 line-through">₹1,24,999</div>
                <div className="font-display font-bold text-2xl text-brand-400">₹99,499</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
