import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useProducts } from '../store/products'
import { useAuth } from '../store/auth'
import { categories } from '../data'
import Footer from '../components/Footer'

const blank = {
  name: '',
  brand: '',
  category: 'engine',
  vehicle: 'Car',
  price: '',
  mrp: '',
  rating: 4.5,
  reviews: 0,
  tag: '',
  images: [],
  desc: '',
}

const TAGS = ['', 'Bestseller', 'Hot', 'New', 'Premium']
const SORTS = [
  { id: 'newest', label: 'Newest' },
  { id: 'name', label: 'Name (A→Z)' },
  { id: 'rating', label: 'Rating (high→low)' },
  { id: 'reviews', label: 'Reviews (high→low)' },
]

const MAX_IMAGE_BYTES = 2 * 1024 * 1024 // 2 MB per image

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function Admin() {
  const { products, add, remove, update, reset } = useProducts()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(blank)
  const [editingId, setEditingId] = useState(null)
  const [msg, setMsg] = useState(null)
  const [urlInput, setUrlInput] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const [query, setQuery] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [filterVeh, setFilterVeh] = useState('all')
  const [sort, setSort] = useState('newest')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const flash = (text, type = 'ok') => {
    setMsg({ type, text })
    setTimeout(() => setMsg(null), 2500)
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  // ---- Image management ----
  const addImages = (urls) => {
    const cleaned = urls.map(u => (u || '').trim()).filter(Boolean)
    if (!cleaned.length) return
    setForm(f => ({ ...f, images: [...f.images, ...cleaned] }))
  }

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter(f => f.type.startsWith('image/'))
    if (!files.length) return
    const tooBig = files.filter(f => f.size > MAX_IMAGE_BYTES)
    const okFiles = files.filter(f => f.size <= MAX_IMAGE_BYTES)
    try {
      const urls = await Promise.all(okFiles.map(readFileAsDataUrl))
      addImages(urls)
      if (tooBig.length) {
        flash(`Skipped ${tooBig.length} file(s) over 2 MB.`, 'err')
      }
    } catch {
      flash('Failed to read one or more files.', 'err')
    }
  }

  const onUrlAdd = () => {
    if (!urlInput.trim()) return
    addImages([urlInput])
    setUrlInput('')
  }

  const removeImage = (idx) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))
  }

  const moveImage = (idx, dir) => {
    setForm(f => {
      const next = [...f.images]
      const j = idx + dir
      if (j < 0 || j >= next.length) return f
      ;[next[idx], next[j]] = [next[j], next[idx]]
      return { ...f, images: next }
    })
  }

  const makeCover = (idx) => {
    setForm(f => {
      if (idx === 0) return f
      const next = [...f.images]
      const [picked] = next.splice(idx, 1)
      next.unshift(picked)
      return { ...f, images: next }
    })
  }

  // ---- Submit ----
  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.brand.trim()) {
      flash('Name and brand are required.', 'err')
      return
    }
    if (!form.images.length) {
      flash('Add at least one image.', 'err')
      return
    }
    const price = form.price === '' ? undefined : Math.max(0, parseFloat(form.price) || 0)
    const mrp = form.mrp === '' ? undefined : Math.max(0, parseFloat(form.mrp) || 0)
    const payload = {
      ...form,
      price,
      mrp,
      image: form.images[0],
      rating: Math.min(5, Math.max(0, parseFloat(form.rating) || 0)),
      reviews: Math.max(0, parseInt(form.reviews) || 0),
      tag: form.tag || undefined,
    }
    if (editingId != null) {
      update(editingId, payload)
      flash('Product updated.')
    } else {
      add(payload)
      flash('Product added. Check the catalogue.')
    }
    setForm(blank)
    setEditingId(null)
    setUrlInput('')
  }

  const startEdit = (p) => {
    setEditingId(p.id)
    setForm({
      name: p.name || '',
      brand: p.brand || '',
      category: p.category || 'engine',
      vehicle: p.vehicle || 'Car',
      price: p.price ?? '',
      mrp: p.mrp ?? '',
      rating: p.rating ?? 0,
      reviews: p.reviews ?? 0,
      tag: p.tag || '',
      images: Array.isArray(p.images) && p.images.length ? p.images : (p.image ? [p.image] : []),
      desc: p.desc || '',
    })
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(blank)
    setUrlInput('')
  }

  const cats = categories.filter(c => c.id !== 'all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = products.filter(p => {
      if (filterCat !== 'all' && p.category !== filterCat) return false
      if (filterVeh !== 'all' && p.vehicle !== filterVeh) return false
      if (!q) return true
      return (
        p.name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.desc?.toLowerCase().includes(q)
      )
    })
    const sorted = [...list]
    if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name))
    else if (sort === 'rating') sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    else if (sort === 'reviews') sorted.sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
    else sorted.sort((a, b) => b.id - a.id)
    return sorted
  }, [products, query, filterCat, filterVeh, sort])

  const stats = useMemo(() => {
    const cars = products.filter(p => p.vehicle === 'Car').length
    const bikes = products.filter(p => p.vehicle === 'Bike').length
    const avg = products.length
      ? products.reduce((s, p) => s + (p.rating || 0), 0) / products.length
      : 0
    return { total: products.length, cars, bikes, avg }
  }, [products])

  const editing = editingId != null

  const discount = useMemo(() => {
    const price = parseFloat(form.price)
    const mrp = parseFloat(form.mrp)
    if (!price || !mrp || mrp <= price) return null
    return Math.round(((mrp - price) / mrp) * 100)
  }, [form.price, form.mrp])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 glass border-b border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 grid place-items-center shadow-glow">
              <span className="text-ink-950 font-black">G</span>
            </span>
            <span>Gear<span className="text-brand-400">Garage</span></span>
          </Link>
          <span className="ml-3 text-xs uppercase tracking-[0.25em] px-2 py-1 rounded-md border border-brand-500/40 text-brand-300 bg-brand-500/10">
            Admin
          </span>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/catalogue" className="text-sm text-zinc-400 hover:text-white transition">View Catalogue →</Link>
            <button
              onClick={() => { if (confirm('Reset to seed data? All custom products will be lost.')) { reset(); cancelEdit() } }}
              className="text-xs px-3 py-1.5 rounded-lg border border-ink-700 hover:border-red-500 hover:text-red-400 transition"
            >
              Reset
            </button>
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-ink-800">
              <span className="w-7 h-7 rounded-full bg-ink-800 border border-ink-700 grid place-items-center text-xs uppercase text-brand-300">
                {(user?.username || '?').slice(0, 1)}
              </span>
              <span className="text-xs text-zinc-400">{user?.username}</span>
              <button
                onClick={handleLogout}
                className="text-xs px-2.5 py-1 rounded-md border border-ink-700 hover:border-zinc-500 text-zinc-400 hover:text-white transition"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total products" value={stats.total} />
          <StatCard label="Car parts" value={stats.cars} />
          <StatCard label="Bike parts" value={stats.bikes} />
          <StatCard label="Avg. rating" value={stats.avg.toFixed(2)} suffix="/ 5" />
        </section>

        <div className="grid lg:grid-cols-[460px_1fr] gap-8">
          {/* FORM */}
          <section className="glass rounded-2xl p-6 h-fit lg:sticky lg:top-24">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="font-display text-2xl font-bold">
                  {editing ? 'Edit product' : 'Add a product'}
                </h1>
                <p className="text-sm text-zinc-500 mt-1">
                  {editing ? `Editing #${editingId}` : 'Stored locally in your browser.'}
                </p>
              </div>
              {editing && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="text-xs px-2.5 py-1 rounded-md border border-ink-700 hover:border-zinc-500 text-zinc-400 hover:text-white transition"
                >
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={submit} className="mt-6 space-y-5">
              <FormGroup title="Basics">
                <Field label="Product name" required>
                  <input value={form.name} onChange={set('name')} placeholder="Brembo GT Brake Kit" className={inputCls} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Brand" required>
                    <input value={form.brand} onChange={set('brand')} placeholder="Brembo" className={inputCls} />
                  </Field>
                  <Field label="Vehicle">
                    <select value={form.vehicle} onChange={set('vehicle')} className={inputCls}>
                      <option>Car</option>
                      <option>Bike</option>
                    </select>
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Category">
                    <select value={form.category} onChange={set('category')} className={inputCls}>
                      {cats.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Tag (optional)">
                    <select value={form.tag} onChange={set('tag')} className={inputCls}>
                      {TAGS.map(t => <option key={t} value={t}>{t || 'None'}</option>)}
                    </select>
                  </Field>
                </div>
              </FormGroup>

              <FormGroup title="Pricing">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Price (₹)">
                    <input
                      type="number" min="0" step="1"
                      value={form.price} onChange={set('price')}
                      placeholder="42999" className={inputCls}
                    />
                  </Field>
                  <Field label="MRP (₹)">
                    <input
                      type="number" min="0" step="1"
                      value={form.mrp} onChange={set('mrp')}
                      placeholder="48999" className={inputCls}
                    />
                  </Field>
                </div>
                {discount != null && (
                  <div className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-md px-3 py-2">
                    {discount}% off — customers save ₹{(parseFloat(form.mrp) - parseFloat(form.price)).toLocaleString('en-IN')}
                  </div>
                )}
              </FormGroup>

              <FormGroup title="Reviews">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Rating (0-5)">
                    <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={set('rating')} className={inputCls} />
                  </Field>
                  <Field label="Reviews count">
                    <input type="number" min="0" value={form.reviews} onChange={set('reviews')} className={inputCls} />
                  </Field>
                </div>
              </FormGroup>

              <FormGroup
                title="Images"
                hint={form.images.length ? `${form.images.length} added · first is the cover` : 'Required · upload files or paste URLs'}
              >
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault(); setDragOver(false)
                    handleFiles(e.dataTransfer.files)
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`cursor-pointer rounded-xl border-2 border-dashed px-4 py-6 text-center transition ${dragOver ? 'border-brand-500 bg-brand-500/10' : 'border-ink-700 hover:border-brand-500/60 hover:bg-ink-800/40'}`}
                >
                  <div className="text-2xl mb-1 opacity-60">⬆</div>
                  <div className="text-sm">Drop images here or <span className="text-brand-400">browse</span></div>
                  <div className="text-[11px] text-zinc-500 mt-1">PNG, JPG, WebP · up to 2 MB each</div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }}
                  />
                </div>

                <div className="flex gap-2">
                  <input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onUrlAdd() } }}
                    placeholder="…or paste an image URL"
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={onUrlAdd}
                    className="px-3 py-2 text-sm rounded-lg border border-ink-700 hover:border-brand-500 hover:text-brand-300 transition whitespace-nowrap"
                  >
                    Add URL
                  </button>
                </div>

                {form.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {form.images.map((src, idx) => (
                      <div
                        key={src + idx}
                        className={`relative group rounded-lg overflow-hidden border ${idx === 0 ? 'border-brand-500/60 ring-1 ring-brand-500/40' : 'border-ink-700'} bg-ink-800`}
                      >
                        <div className="aspect-square">
                          <img
                            src={src}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.style.opacity = '0.2' }}
                          />
                        </div>
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-500 text-ink-950 font-bold">
                            Cover
                          </span>
                        )}
                        <div className="absolute inset-0 bg-ink-950/70 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1">
                          <div className="flex gap-1">
                            <IconBtn title="Move left" onClick={() => moveImage(idx, -1)} disabled={idx === 0}>‹</IconBtn>
                            {idx !== 0 && <IconBtn title="Make cover" onClick={() => makeCover(idx)}>★</IconBtn>}
                            <IconBtn title="Move right" onClick={() => moveImage(idx, 1)} disabled={idx === form.images.length - 1}>›</IconBtn>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="text-[11px] px-2 py-0.5 rounded bg-red-500/80 hover:bg-red-500 text-white"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </FormGroup>

              <FormGroup title="Description">
                <Field label="Marketing blurb">
                  <textarea value={form.desc} onChange={set('desc')} rows={3} placeholder="Short marketing blurb." className={inputCls + ' resize-none'} />
                </Field>
              </FormGroup>

              {msg && (
                <div className={`text-sm px-3 py-2 rounded-lg border ${msg.type === 'ok' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
                  {msg.text}
                </div>
              )}

              <button type="submit" className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-ink-950 font-semibold transition shadow-glow">
                {editing ? 'Save changes' : '+ Add product'}
              </button>
            </form>
          </section>

          {/* LIST */}
          <section>
            <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
              <div>
                <h2 className="font-display text-2xl font-bold">Inventory</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Showing {filtered.length} of {products.length} products
                </p>
              </div>
            </div>

            <div className="glass rounded-2xl p-4 mb-4 grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-3">
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, brand, or description…"
                  className={inputCls + ' pl-9'}
                />
                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className={inputCls}>
                <option value="all">All categories</option>
                {cats.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <select value={filterVeh} onChange={(e) => setFilterVeh(e.target.value)} className={inputCls}>
                <option value="all">All vehicles</option>
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className={inputCls}>
                {SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>

            <div className="glass rounded-2xl overflow-hidden">
              <div className="grid grid-cols-[60px_1.8fr_1fr_1fr_80px_90px] gap-3 px-4 py-3 text-[11px] uppercase tracking-wider text-zinc-500 border-b border-ink-800">
                <div></div>
                <div>Product</div>
                <div>Brand</div>
                <div>Category</div>
                <div>Vehicle</div>
                <div className="text-right">Actions</div>
              </div>

              {filtered.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <div className="text-5xl mb-3 opacity-30">∅</div>
                  <p className="text-zinc-400">No products match your filters.</p>
                  {(query || filterCat !== 'all' || filterVeh !== 'all') && (
                    <button
                      onClick={() => { setQuery(''); setFilterCat('all'); setFilterVeh('all') }}
                      className="mt-3 text-sm text-brand-400 hover:text-brand-300 transition"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-ink-800 max-h-[70vh] overflow-y-auto">
                  {filtered.map(p => {
                    const cover = (p.images && p.images[0]) || p.image
                    const count = p.images?.length || (p.image ? 1 : 0)
                    return (
                      <div
                        key={p.id}
                        className={`grid grid-cols-[60px_1.8fr_1fr_1fr_80px_90px] gap-3 px-4 py-3 items-center transition ${editingId === p.id ? 'bg-brand-500/5 ring-1 ring-inset ring-brand-500/30' : 'hover:bg-ink-800/40'}`}
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-ink-800">
                          {cover && <img src={cover} alt="" className="w-full h-full object-cover" />}
                          {count > 1 && (
                            <span className="absolute bottom-0 right-0 text-[9px] px-1 rounded-tl bg-ink-950/80 text-zinc-300">
                              +{count - 1}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate flex items-center gap-2">
                            {p.name}
                            {p.tag && (
                              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-500/15 text-brand-300 border border-brand-500/30">
                                {p.tag}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-zinc-500 truncate">{p.desc}</div>
                        </div>
                        <div className="text-sm text-brand-400 truncate">{p.brand}</div>
                        <div className="text-sm text-zinc-400 capitalize">{p.category}</div>
                        <div className="text-xs text-zinc-400">{p.vehicle}</div>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => startEdit(p)}
                            className="text-zinc-500 hover:text-brand-400 transition p-1.5 rounded-md hover:bg-ink-800"
                            aria-label="Edit"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${p.name}"?`)) {
                                if (editingId === p.id) cancelEdit()
                                remove(p.id)
                              }
                            }}
                            className="text-zinc-500 hover:text-red-400 transition p-1.5 rounded-md hover:bg-ink-800"
                            aria-label="Delete"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

const inputCls =
  'w-full bg-ink-800/70 border border-ink-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-lg px-3 py-2 text-sm placeholder:text-zinc-600 outline-none transition'

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5">
        {label}{required && <span className="text-brand-400 ml-1">*</span>}
      </span>
      {children}
    </label>
  )
}

function FormGroup({ title, hint, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">{title}</h3>
        {hint && <span className="text-[11px] text-zinc-500">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

function StatCard({ label, value, suffix }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-xs uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="mt-2 font-display text-3xl font-bold">
        {value}
        {suffix && <span className="text-base font-medium text-zinc-500 ml-1">{suffix}</span>}
      </div>
    </div>
  )
}

function IconBtn({ children, onClick, disabled, title }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick?.() }}
      disabled={disabled}
      title={title}
      className="w-7 h-7 grid place-items-center rounded bg-ink-800/80 hover:bg-ink-700 text-white text-sm disabled:opacity-30 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  )
}
