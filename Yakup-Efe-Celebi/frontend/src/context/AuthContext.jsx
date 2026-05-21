import { createContext, useContext, useEffect, useState } from 'react'
import { FURKAN_AUTH_BASE, clearAuth, getToken, getUser, setToken } from '../lib/auth'

// Yakup's frontend uses Furkan's auth service (port 8080) for login/register,
// since auth is a Furkan-owned domain in BOSE's per-developer split. The token
// is then stored in a host-scoped cookie so every BOSE frontend on localhost
// inherits the same JWT.

const AuthContext = createContext()

async function furkanFetch(path, init = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...(init.headers ?? {}) }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${FURKAN_AUTH_BASE}${path}`, { ...init, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || `HTTP ${res.status}`)
    err.response = { status: res.status, data }
    throw err
  }
  return data
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(getUser)
  const [token, setTokenState] = useState(getToken)
  const [loading, setLoading] = useState(Boolean(getToken()))

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    const cached = getUser()
    if (!cached?.ID) {
      setLoading(false)
      return
    }
    furkanFetch(`/users/${cached.ID}`)
      .then((data) => {
        if (data.user) {
          setUserState(data.user)
          setToken(token, data.user)
        }
      })
      .catch(() => {
        clearAuth()
        setTokenState(null)
        setUserState(null)
      })
      .finally(() => setLoading(false))
  }, [token])

  const login = async (email, password) => {
    const data = await furkanFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    setToken(data.token, data.user)
    setTokenState(data.token)
    setUserState(data.user)
    return data.user
  }

  const register = async (fullName, email, password) => {
    const data = await furkanFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ full_name: fullName, email, password }),
    })
    setToken(data.token, data.user)
    setTokenState(data.token)
    setUserState(data.user)
    return data.user
  }

  const logout = () => {
    clearAuth()
    setTokenState(null)
    setUserState(null)
  }

  const refreshUser = async () => {
    if (!user?.ID) return
    try {
      const data = await furkanFetch(`/users/${user.ID}`)
      if (data.user) {
        setUserState(data.user)
        setToken(token, data.user)
      }
    } catch {
      /* ignore */
    }
  }

  const setUser = (u) => {
    setUserState(u)
    setToken(token, u)
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
