import axios from 'axios'
import { useAuthStore } from '../store/authStore'

// ── Detect backend base URL ─────────────────────────────────────────────────
const BACKEND = import.meta.env.VITE_API_URL || '/api'

// ── Primary API client (all /api/* routes) ─────────────────────────────────
const api = axios.create({
  baseURL: BACKEND,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})

// ── AI client (same backend, longer timeout for AI analysis) ────────────────
const aiClient = axios.create({
  baseURL: `${BACKEND}/ai`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60_000,
})

// Shared interceptor setup for both instances
;[api, aiClient].forEach((instance) => {
  instance.interceptors.request.use(
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

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Only auto-logout on 401 from auth/user endpoints (shared backend)
      // Other backends may use different JWT secrets — don't logout for those
      const url = error.config?.url || ''
      const isAuthRoute = url.includes('/auth/') || url.includes('/users/')
      if (error.response?.status === 401 && isAuthRoute) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  )
})

// ── Auth endpoints ──────────────────────────────────────────────────────────
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
}

// ── User endpoints ──────────────────────────────────────────────────────────
export const userApi = {
  getProfile:    (id)        => api.get(`/users/${id}`),
  updateProfile: (id, data)  => api.put(`/users/${id}`, data),
  deleteAccount: (id)        => api.delete(`/users/${id}`),
  updateAIPrefs: (id, data)  => api.post(`/users/${id}/ai-preferences`, data),
}

// ── Admin endpoints (Furkan) ────────────────────────────────────────────────
export const adminApi = {
  getLogs:            ()          => api.get('/admin/logs'),
  deleteUser:         (id)        => api.delete(`/admin/users/${id}`),
  updateUserRole:     (id, role)  => api.put(`/admin/users/${id}/role`, { role }),
  createAnnouncement: (message)   => api.post('/admin/announcements', { message }),
}

// ── Trading endpoints (shared backend — overview page) ──────────────────────
export const tradingApi = {
  placeOrder:    (data) => api.post('/trading/order', data),
  getPositions:  ()     => api.get('/trading/positions'),
  closePosition: (id)   => api.post(`/trading/positions/${id}/close`),
  getHistory:    ()     => api.get('/trading/history'),
  getPortfolio:  ()     => api.get('/trading/portfolio'),
}

// ── Market endpoints (public) ───────────────────────────────────────────────
export const marketApi = {
  getAll: () => api.get('/market/assets'),
}

// ── Watchlist endpoints ─────────────────────────────────────────────────────
export const watchlistApi = {
  getAll:      ()              => api.get('/watchlist/'),
  create:      (name)          => api.post('/watchlist/', { name }),
  delete:      (wlId)          => api.delete(`/watchlist/${wlId}`),
  addItem:     (wlId, symbol)  => api.post(`/watchlist/${wlId}/items`, { symbol }),
  deleteItem:  (wlId, itemId)  => api.delete(`/watchlist/${wlId}/items/${itemId}`),
}

// ── Alert endpoints ─────────────────────────────────────────────────────────
export const alertApi = {
  getAll:       ()     => api.get('/watchlist/alerts'),
  create:       (data) => api.post('/watchlist/alerts', data),
  delete:       (id)   => api.delete(`/watchlist/alerts/${id}`),
  getTriggered: ()     => api.get('/watchlist/alerts/triggered'),
}

// ── AI Report endpoints (Enes — uses aiClient) ─────────────────────────────
export const aiReportsApi = {
  analyzePortfolio:    (data) => aiClient.post('/reports/portfolio', data),
  analyzeWatchlist:    (data) => aiClient.post('/reports/watchlist', data),
  analyzeTransactions: (data) => aiClient.post('/reports/transactions', data),
}

// ── AI Chat endpoint (Enes — uses aiClient) ─────────────────────────────────
export const aiChatApi = {
  send: (data) => aiClient.post('/chat', data),
}

// ── Leaderboard endpoints (shared backend) ──────────────────────────────────
export const leaderboardApi = {
  getRankings:     ()   => api.get('/leaderboard/rankings'),
  getUserRank:     (id) => api.get(`/leaderboard/user/${id}`),
  getAchievements: ()   => api.get('/leaderboard/achievements'),
}

export default api
