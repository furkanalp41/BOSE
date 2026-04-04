import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})

// Request interceptor — attach JWT
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

// Response interceptor — handle auth errors globally
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

// ── Auth endpoints ──────────────────────────────────────────────────────────
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
}

// ── User endpoints (JWT-resolved, no ID in URL) ────────────────────────────
export const userApi = {
  getProfile:    ()          => api.get('/users/profile'),
  updateProfile: (_id, data) => api.put('/users/profile', data),
  deleteAccount: ()          => api.delete('/users/profile'),
  updateAIPrefs: (_id, data) => api.put('/users/ai-preferences', data),
}

// ── Admin endpoints (RequireAuth + RequireAdmin) ────────────────────────���───
export const adminApi = {
  getLogs:             ()          => api.get('/admin/logs'),
  deleteUser:          (id)        => api.delete(`/admin/users/${id}`),
  updateUserRole:      (id, role)  => api.put(`/admin/users/${id}/role`, { role }),
  createAnnouncement:  (message)   => api.post('/admin/announcements', { message }),
}

export default api
