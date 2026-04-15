import { useCallback, useSyncExternalStore } from 'react'

const KEY = 'gg.auth.v1'
const CREDS_KEY = 'gg.auth.creds.v1'
const DEFAULT_CREDS = { username: 'admin', password: 'admin' }

let cachedRaw = null
let cachedValue = null

function readSession() {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (raw === cachedRaw) return cachedValue
    cachedRaw = raw
    cachedValue = raw ? JSON.parse(raw) : null
    return cachedValue
  } catch {
    cachedRaw = null
    cachedValue = null
    return null
  }
}

function writeSession(value) {
  if (value) sessionStorage.setItem(KEY, JSON.stringify(value))
  else sessionStorage.removeItem(KEY)
  cachedRaw = null
  window.dispatchEvent(new Event('gg:auth'))
}

function readCreds() {
  try {
    const raw = localStorage.getItem(CREDS_KEY)
    if (!raw) return DEFAULT_CREDS
    return { ...DEFAULT_CREDS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_CREDS
  }
}

const subscribe = (cb) => {
  const handler = () => cb()
  window.addEventListener('gg:auth', handler)
  window.addEventListener('storage', handler)
  return () => {
    window.removeEventListener('gg:auth', handler)
    window.removeEventListener('storage', handler)
  }
}

export const DEMO_CREDS = DEFAULT_CREDS

export function useAuth() {
  const session = useSyncExternalStore(subscribe, readSession, () => null)

  const login = useCallback((username, password) => {
    const creds = readCreds()
    if (username === creds.username && password === creds.password) {
      writeSession({ username, at: Date.now() })
      return { ok: true }
    }
    return { ok: false, error: 'Invalid username or password.' }
  }, [])

  const logout = useCallback(() => writeSession(null), [])

  return { user: session, isAuthed: !!session, login, logout }
}
