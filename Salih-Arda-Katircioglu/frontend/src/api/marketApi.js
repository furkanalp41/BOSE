import axios from 'axios'
import { clearAuth, getToken } from '../lib/auth'

// Yakup Efe's service owns ALL market data (prices, assets, WS stream).
// Cross-service axios instance pinned to :8084, reusing the cross-port
// JWT cookie so the Bearer token is the same as on this frontend's own axios.
const MARKET_BASE_HTTP = 'http://localhost:8084/api/v1'
export const MARKET_WS_URL = 'ws://localhost:8084/api/v1/market/stream'

const marketApi = axios.create({
  baseURL: MARKET_BASE_HTTP,
  headers: { 'Content-Type': 'application/json' },
})

marketApi.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

marketApi.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) clearAuth()
    return Promise.reject(error)
  }
)

export default marketApi
