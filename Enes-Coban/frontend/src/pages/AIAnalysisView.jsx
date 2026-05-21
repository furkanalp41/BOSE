import { useState } from 'react'
import api from '../api/axios'
import { MessageCircle, Loader2, Send } from 'lucide-react'

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
        <MessageCircle size={28} className="text-purple-400" />
        <h1 className="text-2xl font-bold text-slate-100">AI Chat</h1>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col" style={{ height: '550px' }}>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              <MessageCircle size={40} className="mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium">AI Finansal Asistan</p>
              <p className="text-sm mt-1">Portfoyunuz hakkinda sorular sorun, piyasa analizleri isteyin...</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${m.role === 'user'
                ? 'bg-purple-600 text-white rounded-br-md'
                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-md'}`}>
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-md px-4 py-3">
                <Loader2 size={16} className="animate-spin text-purple-400" />
              </div>
            </div>
          )}
        </div>
        <form onSubmit={sendMessage} className="p-4 border-t border-slate-800 flex gap-2">
          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Mesajinizi yazin..." />
          <button type="submit" disabled={loading || !input.trim()}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-medium rounded-lg transition-colors inline-flex items-center gap-2">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}
