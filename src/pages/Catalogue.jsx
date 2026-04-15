import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { categories, vehicleTypes } from '../data'
import { useProducts } from '../store/products'
import Navbar from '../components/Navbar'
import CategoryBar from '../components/CategoryBar'
import Toolbar from '../components/Toolbar'
import ProductCard from '../components/ProductCard'
import Footer from '../components/Footer'

export default function Catalogue() {
  const { products } = useProducts()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(params.get('category') || 'all')
  const [vehicle, setVehicle] = useState('All')
  const [sort, setSort] = useState('popular')
  const [wishlist, setWishlist] = useState(() => new Set())

  useEffect(() => {
    const next = new URLSearchParams(params)
    if (category === 'all') next.delete('category')
    else next.set('category', category)
    setParams(next, { replace: true })
  }, [category])

  const toggleWish = (id) => {
    setWishlist(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  const filtered = useMemo(() => {
    let list = products.filter(p => {
      const matchQ = !query || (p.name + p.brand + p.desc).toLowerCase().includes(query.toLowerCase())
      const matchC = category === 'all' || p.category === category
      const matchV = vehicle === 'All' || p.vehicle === vehicle
      return matchQ && matchC && matchV
    })
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    return list
  }, [products, query, category, vehicle, sort])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar query={query} setQuery={setQuery} wishCount={wishlist.size} />
      <CategoryBar categories={categories} active={category} onChange={setCategory} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Toolbar
          total={filtered.length}
          vehicle={vehicle}
          setVehicle={setVehicle}
          vehicleTypes={vehicleTypes}
          sort={sort}
          setSort={setSort}
        />
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-zinc-400">No parts match your filters. Try resetting.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((p, i) => (
              <div key={p.id} style={{ animationDelay: `${i * 40}ms` }} className="animate-fadeUp">
                <ProductCard
                  product={p}
                  wished={wishlist.has(p.id)}
                  onWish={() => toggleWish(p.id)}
                />
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
