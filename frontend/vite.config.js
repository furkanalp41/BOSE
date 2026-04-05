import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // ── All API routes → Go backend (port 8080) with /api → /api/v1 rewrite ─
      '/api/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/auth/, '/api/v1/auth'),
      },
      '/api/users': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/users/, '/api/v1/users'),
      },
      '/api/market': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/market/, '/api/v1/market'),
      },
      '/api/trading': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/trading/, '/api/v1/trading'),
      },
      '/api/leaderboard': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/leaderboard/, '/api/v1/leaderboard'),
      },
      '/api/admin': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/admin/, '/api/v1/admin'),
      },
      '/api/watchlist': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/watchlist/, '/api/v1/watchlist'),
      },
      '/api/ai': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ai/, '/api/v1/ai'),
      },
      // ── Enes AI client (baseURL /ai) → rewrite to /api/v1/ai ───────────
      '/ai': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ai/, '/api/v1/ai'),
      },
      // ── WebSocket ───────────────────────────────────────────────────────
      '/ws': {
        target: 'ws://localhost:8080',
        ws: true,
      },
    },
  },
})
