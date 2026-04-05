import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})

const aiClient = axios.create({
  baseURL: '/ai',
  headers: { 'Content-Type': 'application/json' },
  timeout: 60_000,
})

// Shared interceptor setup
;[api, aiClient].forEach(instance => {
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
      if (error.response?.status === 401) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  )
})

// ── AI Report endpoints ───���─────────────────────────────────────────────────
export const aiReportsApi = {
  analyzePortfolio:     (data) => aiClient.post('/reports/portfolio', data),
  analyzeWatchlist:     (data) => aiClient.post('/reports/watchlist', data),
  analyzeTransactions:  (data) => aiClient.post('/reports/transactions', data),
  testPortfolio:        ()     => aiClient.get('/reports/portfolio/test'),
}

// ── AI Chat endpoint ───────���────────────────────────────────���───────────────
export const aiChatApi = {
  send: (data) => aiClient.post('/chat', data),
}

export default api
