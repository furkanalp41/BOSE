import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})

api.interceptors.request.use(
  (config) => {
    const raw = localStorage.getItem('bose-auth')
    if (raw) {
      const parsed = JSON.parse(raw)
      const token = parsed?.state?.token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ── Market endpoints (public) ───────────────────────────────────────────────
export const marketApi = {
  getAll:   ()           => api.get('/market/'),
  create:   (data)       => api.post('/market/', data),
  update:   (id, data)   => api.put(`/market/${id}`, data),
  delete:   (id)         => api.delete(`/market/${id}`),
}

// ── Watchlist endpoints (protected) ─────────────────────────────────────────
export const watchlistApi = {
  create:   (name)           => api.post('/watchlist/', { name }),
  addItem:  (wlId, itemId)   => api.post(`/watchlist/${wlId}/items`, { market_item_id: itemId }),
}

// ── Alert endpoints (protected) ─────────────────────────────────────────────
export const alertApi = {
  create: (data) => api.post('/watchlist/alerts', data),
}

export default api
