import { useCallback, useEffect, useSyncExternalStore } from 'react'
import { products as seed } from '../data'

const KEY = 'gg.products.v1'

function normalize(p) {
  const images = Array.isArray(p.images) && p.images.length
    ? p.images.filter(Boolean)
    : (p.image ? [p.image] : [])
  return { ...p, images, image: images[0] || p.image || '' }
}

let cachedRaw = null
let cachedValue = seed

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw === cachedRaw) return cachedValue
    cachedRaw = raw
    if (!raw) {
      cachedValue = seed
      return cachedValue
    }
    const parsed = JSON.parse(raw)
    cachedValue = Array.isArray(parsed) ? parsed : seed
    return cachedValue
  } catch {
    cachedValue = seed
    return cachedValue
  }
}

function write(list) {
  localStorage.setItem(KEY, JSON.stringify(list))
  cachedRaw = null
  window.dispatchEvent(new Event('gg:products'))
}

const subscribe = (cb) => {
  const handler = () => cb()
  window.addEventListener('gg:products', handler)
  window.addEventListener('storage', handler)
  return () => {
    window.removeEventListener('gg:products', handler)
    window.removeEventListener('storage', handler)
  }
}

const getServer = () => seed

export function useProducts() {
  const snapshot = useSyncExternalStore(subscribe, read, getServer)

  useEffect(() => {
    if (!localStorage.getItem(KEY)) write(seed)
  }, [])

  const add = useCallback((p) => {
    const list = read()
    const id = Math.max(0, ...list.map(x => x.id)) + 1
    write([normalize({ ...p, id }), ...list])
  }, [])

  const remove = useCallback((id) => {
    write(read().filter(p => p.id !== id))
  }, [])

  const update = useCallback((id, patch) => {
    write(read().map(p => (p.id === id ? normalize({ ...p, ...patch, id }) : p)))
  }, [])

  const reset = useCallback(() => {
    write(seed)
  }, [])

  return { products: snapshot, add, remove, update, reset }
}
