import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { aiChatApi } from '../services/api'

export default function AIChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState('en')
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text) => {
    const content = text || input.trim()
    if (!content || loading) return
    setInput('')

    const userMsg = { role: 'user', content }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setLoading(true)

    try {
      const { data } = await aiChatApi.send({
        user_context: { user_id: 'ui-user', risk_preference: 5 },
        messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        language,
      })
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply,
        referenced_symbols: data.referenced_symbols,
        suggested_actions: data.suggested_actions,
        follow_up_questions: data.follow_up_questions,
      }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: err.response?.data?.error || 'Failed to get response. Please try again.',
      }])
    } finally { setLoading(false) }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const ACTION_COLORS = {
    buy: 'text-neon bg-neon/10 border-neon/20',
    sell: 'text-crimson bg-crimson/10 border-crimson/20',
    add_to_watchlist: 'text-ice bg-ice/10 border-ice/20',
    analyze: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="glass flex flex-col" style={{ height: 'calc(100vh - 140px)' }}>

      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-neon/10 border border-purple-500/20 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-cloud">AI Chat</h3>
            <p className="text-silver text-xs">Ask anything about markets & trading</p>
          </div>
        </div>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}
          className="input-base py-1.5 px-3 text-xs bg-void appearance-none cursor-pointer">
          <option value="en">EN</option>
          <option value="tr">TR</option>
        </select>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <p className="text-silver text-sm">Start a conversation with the AI assistant</p>
            <p className="text-silver/50 text-xs mt-1">Ask about portfolio strategy, market analysis, or trading tips</p>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 rounded-2xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-neon/10 border border-neon/20 text-cloud rounded-br-md'
                    : 'bg-white/[0.04] border border-border text-cloud rounded-bl-md'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {msg.referenced_symbols?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {msg.referenced_symbols.map((sym, j) => (
                      <span key={j} className="text-[10px] font-bold px-2 py-0.5 rounded border text-ice bg-ice/10 border-ice/20">
                        {sym}
                      </span>
                    ))}
                  </div>
                )}

                {msg.suggested_actions?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {msg.suggested_actions.map((action, j) => (
                      <div key={j} className={`px-3 py-2 rounded-lg border text-xs ${ACTION_COLORS[action.action_type] || 'text-silver bg-white/5 border-border'}`}>
                        <span className="font-bold uppercase">{action.action_type}</span>
                        {action.symbol && <span className="font-mono ml-1">{action.symbol}</span>}
                        <p className="text-silver text-[10px] mt-0.5">{action.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {msg.follow_up_questions?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {msg.follow_up_questions.map((q, j) => (
                      <button key={j} onClick={() => handleSend(q)}
                        className="px-3 py-1.5 rounded-lg text-[11px] text-silver border border-border hover:border-white/20 hover:text-cloud transition-colors text-left">
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white/[0.04] border border-border">
              <motion.span className="block w-5 h-5 border-2 border-neon/30 border-t-neon rounded-full"
                animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex gap-3">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
            placeholder="Type a message..." rows="1"
            className="input-base py-3 text-sm flex-1 resize-none" />
          <button onClick={() => handleSend()} disabled={loading || !input.trim()}
            className="px-5 rounded-xl text-sm font-bold bg-neon text-void hover:shadow-neon-md active:scale-[0.98] transition-all duration-300 disabled:opacity-40">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
