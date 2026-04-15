import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

const brands = [
  {
    name: 'Brembo',
    tag: 'Italian Braking Mastery',
    category: 'brakes',
    accent: 'from-red-500 to-red-700',
    image: 'https://images.unsplash.com/photo-1629385701021-fcd568a743e2?w=1200&q=80',
    blurb: 'Motorsport-derived stopping power. Used in F1, MotoGP, and on the cars you love.',
  },
  {
    name: 'Akrapovič',
    tag: 'Titanium Symphony',
    category: 'exhaust',
    accent: 'from-brand-400 to-brand-600',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&q=80',
    blurb: 'Hand-welded in Slovenia. The sound of performance, forged in titanium.',
  },
  {
    name: 'Öhlins',
    tag: 'Swedish Precision',
    category: 'suspension',
    accent: 'from-yellow-400 to-amber-600',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&q=80',
    blurb: 'Gold-standard damping. Every road feels intentional.',
  },
]

const marqueeItems = ['BREMBO', 'K&N', 'AKRAPOVIČ', 'ÖHLINS', 'MICHELIN', 'BOSCH', 'PIRELLI', 'BMC', 'HAWK', 'KONI', 'OSRAM', 'RIZOMA']

function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

export default function Home() {
  const navigate = useNavigate()
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const heroRef = useRef(null)

  const onMove = (e) => {
    const r = heroRef.current?.getBoundingClientRect()
    if (!r) return
    setMouse({
      x: ((e.clientX - r.left) / r.width - 0.5) * 2,
      y: ((e.clientY - r.top) / r.height - 0.5) * 2,
    })
  }

  const [brandsRef, brandsVisible] = useReveal()
  const [ctaRef, ctaVisible] = useReveal()

  return (
    <div className="relative overflow-hidden">
      <HomeNav />

      {/* HERO */}
      <section
        ref={heroRef}
        onMouseMove={onMove}
        className="relative min-h-screen flex items-center justify-center px-4"
      >
        {/* animated blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-brand-500/20 blur-3xl animate-blob" />
          <div className="absolute top-20 -right-40 w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
          <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full bg-sky-500/10 blur-3xl animate-blob" style={{ animationDelay: '8s' }} />
        </div>

        {/* grid overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          }}
        />

        <div
          className="relative z-10 text-center max-w-5xl"
          style={{ transform: `translate3d(${mouse.x * -8}px, ${mouse.y * -8}px, 0)`, transition: 'transform 0.25s ease-out' }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-medium mb-8 animate-reveal">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
            Performance. Distilled.
          </div>

          <h1 className="font-display font-bold tracking-tight leading-[0.95] text-[clamp(3rem,10vw,9rem)]">
            <AnimatedLine text="ENGINEERED" delay={0} />
            <div className="bg-gradient-to-r from-brand-300 via-brand-400 to-brand-600 bg-clip-text text-transparent animate-reveal" style={{ animationDelay: '0.3s' }}>
              FOR SPEED
            </div>
            <AnimatedLine text="LOVED BY FEW." delay={0.6} />
          </h1>

          <p className="mt-8 text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto animate-reveal" style={{ animationDelay: '0.9s' }}>
            Premium car & bike parts curated for those who hear the difference
            between "good enough" and <em className="text-brand-300 not-italic">perfect</em>.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-reveal" style={{ animationDelay: '1.1s' }}>
            <Link
              to="/catalogue"
              className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-ink-950 font-semibold transition shadow-glow overflow-hidden"
            >
              <span className="relative z-10">Enter the Catalogue</span>
              <svg className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M13 5l7 7-7 7"/>
              </svg>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>
            <a href="#brands" className="px-7 py-3.5 rounded-xl border border-ink-700 hover:border-brand-500 hover:bg-ink-800/60 font-medium transition">
              Our Brands
            </a>
          </div>
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-floaty">
          <div className="flex flex-col items-center gap-2 text-zinc-500 text-xs tracking-widest uppercase">
            <span>Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-brand-400 to-transparent" />
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="relative border-y border-ink-800/80 bg-ink-950/50 py-8">
        <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <div className="flex shrink-0 animate-marquee gap-16 pr-16">
            {[...marqueeItems, ...marqueeItems].map((b, i) => (
              <span key={i} className="font-display font-bold text-2xl md:text-3xl text-zinc-600 hover:text-brand-400 transition whitespace-nowrap">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* BRANDS */}
      <section
        id="brands"
        ref={brandsRef}
        className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 transition-all duration-1000 ${brandsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-brand-400 font-semibold mb-4">
            — Flagship Partners
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            Built with the <span className="italic text-brand-400">best</span>.
          </h2>
          <p className="mt-5 text-zinc-400 text-lg">
            We stock only the three brands we'd run on our own builds. Pick your poison.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {brands.map((b, i) => (
            <button
              key={b.name}
              onClick={() => navigate(`/catalogue?category=${b.category}`)}
              style={{ transitionDelay: `${i * 120}ms` }}
              className={`group relative text-left rounded-3xl overflow-hidden border border-ink-800 bg-ink-900 aspect-[3/4] transition-all duration-700 hover:-translate-y-2 ${brandsVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}
            >
              <img
                src={b.image}
                alt={b.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110 opacity-60 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-transparent" />
              <div className={`absolute inset-0 bg-gradient-to-br ${b.accent} opacity-0 group-hover:opacity-20 transition-opacity duration-500 mix-blend-overlay`} />

              <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-400">0{i + 1} / 03</span>
                <span className="w-10 h-10 rounded-full border border-ink-700 group-hover:border-brand-400 group-hover:bg-brand-400 transition-all duration-500 grid place-items-center">
                  <svg className="w-4 h-4 text-zinc-400 group-hover:text-ink-950 transition-all duration-500 -rotate-45 group-hover:rotate-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M13 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="text-[11px] uppercase tracking-[0.3em] text-brand-400 font-semibold mb-2">
                  {b.tag}
                </div>
                <div className="font-display font-bold text-4xl md:text-5xl leading-none transition-transform duration-500 group-hover:-translate-y-1">
                  {b.name}
                </div>
                <p className="mt-4 text-sm text-zinc-400 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 max-h-0 group-hover:max-h-32 overflow-hidden">
                  {b.blurb}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
                  Explore {b.category}
                  <span className="h-px w-8 bg-brand-400 group-hover:w-12 transition-all" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        ref={ctaRef}
        className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 transition-all duration-1000 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="relative overflow-hidden rounded-3xl border border-ink-800 bg-gradient-to-br from-ink-900 to-ink-950 p-10 md:p-20 text-center">
          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(242,131,13,0.3), transparent 40%), radial-gradient(circle at 80% 70%, rgba(168,85,247,0.2), transparent 40%)',
            }}
          />
          <div className="relative">
            <h3 className="font-display text-3xl md:text-5xl font-bold max-w-3xl mx-auto leading-tight">
              Your build deserves the <span className="text-brand-400">real thing</span>.
            </h3>
            <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
              500+ parts. 120+ brands. Zero compromises.
            </p>
            <Link
              to="/catalogue"
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-ink-950 font-semibold transition shadow-glow"
            >
              Browse the Full Catalogue
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M13 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function AnimatedLine({ text, delay = 0 }) {
  return (
    <div className="block overflow-hidden">
      <div className="animate-reveal" style={{ animationDelay: `${delay}s` }}>
        {text}
      </div>
    </div>
  )
}

function HomeNav() {
  return (
    <header className="absolute top-0 inset-x-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 grid place-items-center shadow-glow">
            <span className="text-ink-950 font-black">G</span>
          </span>
          <span>Gear<span className="text-brand-400">Garage</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 ml-10 text-sm text-zinc-400">
          <Link to="/catalogue" className="hover:text-white transition">Catalogue</Link>
          <a href="#brands" className="hover:text-white transition">Brands</a>
          <a href="#" className="hover:text-white transition">Garage</a>
          <a href="#" className="hover:text-white transition">Contact</a>
        </nav>
        <Link
          to="/catalogue"
          className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-ink-700 hover:border-brand-500 hover:bg-ink-800/60 text-sm font-medium transition"
        >
          Explore →
        </Link>
      </div>
    </header>
  )
}
