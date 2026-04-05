import { useEffect, useRef, useState, useCallback } from 'react'

const MAX_HISTORY = 60

// Derive WebSocket URL from VITE_API_URL (https://x → wss://x) or fallback to same host
function resolveWsUrl() {
  if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL
  const api = import.meta.env.VITE_API_URL
  if (api) {
    return api.replace(/^https:/, 'wss:').replace(/^http:/, 'ws:').replace(/\/api\/v1$/, '') + '/ws/market'
  }
  return `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/market`
}

// Derive REST base from VITE_API_URL or fallback
const API_BASE = import.meta.env.VITE_API_URL || '/api'

export function useMarketSocket() {
  const [prices, setPrices] = useState({})
  const [history, setHistory] = useState({})
  const [assets, setAssets] = useState([])
  const [status, setStatus] = useState('connecting')
  const wsRef = useRef(null)
  const reconnectRef = useRef(null)

  // Fetch REST assets once
  useEffect(() => {
    fetch(`${API_BASE}/market/assets`)
      .then(r => r.json())
      .then(json => setAssets(json.data ?? []))
      .catch(() => setAssets([]))
  }, [])

  const connect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.onclose = null
      wsRef.current.close()
    }

    setStatus('connecting')
    const ws = new WebSocket(resolveWsUrl())
    wsRef.current = ws

    ws.onopen = () => setStatus('live')

    ws.onmessage = (ev) => {
      try {
        const { ticks } = JSON.parse(ev.data)
        if (!Array.isArray(ticks)) return

        setPrices(prev => {
          const next = { ...prev }
          ticks.forEach(tick => {
            const direction = tick.changePct >= 0 ? 'up' : 'down'
            next[tick.symbol] = { ...tick, direction }
          })
          return next
        })

        setHistory(prev => {
          const next = { ...prev }
          ticks.forEach(tick => {
            const arr = next[tick.symbol] ? [...next[tick.symbol]] : []
            arr.push({ t: tick.timestamp, price: tick.price })
            if (arr.length > MAX_HISTORY) arr.shift()
            next[tick.symbol] = arr
          })
          return next
        })
      } catch (_) { /* ignore malformed */ }
    }

    ws.onerror = () => setStatus('error')

    ws.onclose = () => {
      setStatus('error')
      reconnectRef.current = setTimeout(connect, 3000)
    }
  }, [])

  useEffect(() => {
    connect()
    return () => {
      clearTimeout(reconnectRef.current)
      if (wsRef.current) {
        wsRef.current.onclose = null
        wsRef.current.close()
      }
    }
  }, [connect])

  return { prices, history, assets, status }
}
