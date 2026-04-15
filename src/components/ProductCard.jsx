const tagStyles = {
  Bestseller: 'bg-brand-500 text-ink-950',
  Hot: 'bg-red-500 text-white',
  New: 'bg-emerald-500 text-ink-950',
  Premium: 'bg-purple-500 text-white',
}

export default function ProductCard({ product, wished, onWish }) {
  return (
    <article className="group relative bg-ink-900/70 border border-ink-800 rounded-2xl overflow-hidden card-hover">
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-800">
        <img
          src={(product.images && product.images[0]) || product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex gap-2">
          {product.tag && (
            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${tagStyles[product.tag] ?? 'bg-ink-700'}`}>
              {product.tag}
            </span>
          )}
        </div>

        <button
          onClick={onWish}
          aria-label="Wishlist"
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur bg-ink-950/60 border border-ink-700 hover:border-brand-500 transition ${wished ? 'text-brand-400' : 'text-zinc-300'}`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        <div className="absolute bottom-3 left-3 text-[10px] uppercase tracking-wider font-semibold text-zinc-300 bg-ink-950/60 backdrop-blur border border-ink-700 px-2 py-1 rounded-md">
          {product.vehicle}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs uppercase tracking-wider font-semibold text-brand-400">{product.brand}</span>
          <span className="flex items-center gap-1 text-xs text-zinc-400">
            <svg className="w-3.5 h-3.5 text-brand-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            {product.rating} <span className="text-zinc-600">({product.reviews})</span>
          </span>
        </div>

        <h3 className="font-display font-semibold leading-snug line-clamp-2 min-h-[3rem] group-hover:text-brand-300 transition">
          {product.name}
        </h3>
        <p className="text-sm text-zinc-500 mt-1 line-clamp-2 min-h-[2.5rem]">{product.desc}</p>
      </div>
    </article>
  )
}
