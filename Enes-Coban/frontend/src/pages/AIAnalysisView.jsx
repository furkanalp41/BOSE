import { useState } from 'react'
import api from '../api/axios'
import { MessageCircle, Loader2, Send } from 'lucide-react'
import GlassCard from '../ui/GlassCard'
import NeonButton from '../ui/NeonButton'

export default function AIAnalysisView() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return
    const userMsg = input.trim()
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setInput('')
    setLoading(true)
    try {
      const r = await api.post('/ai/chat', { message: userMsg })
      setMessages(prev => [...prev, { role: 'assistant', content: r.data.response || r.data.data || 'Yanit alinamadi.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Hata: Yanit alinamadi.' }])
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageCircle size={28} className="text-neon" />
        <h1 className="text-2xl font-bold text-cloud">AI Chat</h1>
      </div>

      <GlassCard className="overflow-hidden flex flex-col p-0" style={{ height: '550px' }}>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-20 text-silver">
              <MessageCircle size={40} className="mx-auto mb-3 text-neon opacity-50" />
              <p className="text-lg font-medium text-cloud">AI Finansal Asistan</p>
              <p className="text-sm mt-1">Portfoyunuz hakkinda sorular sorun, piyasa analizleri isteyin...</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${m.role === 'user'
                ? 'bg-neon/15 text-cloud border border-neon/30 rounded-br-md'
                : 'bg-white/5 text-cloud border border-edge rounded-bl-md'}`}>
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-edge rounded-2xl rounded-bl-md px-4 py-3">
                <Loader2 size={16} className="animate-spin text-neon" />
              </div>
            </div>
          )}
        </div>
        <form onSubmit={sendMessage} className="p-4 border-t border-edge flex gap-2">
          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            className="input-base flex-1"
            placeholder="Mesajinizi yazin..." />
          <NeonButton type="submit" disabled={loading || !input.trim()}>
            <Send size={16} />
          </NeonButton>
        </form>
      </GlassCard>
    </div>
  )
}
