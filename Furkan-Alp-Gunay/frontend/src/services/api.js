import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: '/api/v1',
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

// ── User endpoints ──────────────────────────────────────────────────────────
export const userApi = {
  getProfile:    (id)        => api.get(`/users/${id}`),
  updateProfile: (id, data)  => api.put(`/users/${id}`, data),
  deleteAccount: (id)        => api.delete(`/users/${id}`),
  updateAIPrefs: (id, data)  => api.post(`/users/${id}/ai-preferences`, data),
}

export default api
