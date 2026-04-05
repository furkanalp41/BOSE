import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DeleteModal({ isOpen, onClose, onConfirm, loading }) {
  const [step, setStep] = useState(1)
  const [typed, setTyped] = useState('')
  const confirmed = typed === 'DELETE'

  const handleClose = () => { setStep(1); setTyped(''); onClose() }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }} className="fixed inset-0 z-50 bg-void/80 backdrop-blur-glass" onClick={handleClose} />
          <motion.div key="modal" initial={{ opacity: 0, scale: 0.88, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }} transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-md bg-panel border border-crimson/30 rounded-2xl shadow-crimson-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}>
              <div className="h-1 bg-gradient-to-r from-crimson via-crimson/60 to-transparent" />
              <div className="p-7 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-crimson/10 border border-crimson/30 flex items-center justify-center flex-shrink-0">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff3b5c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-cloud">Delete Account</h3>
                    <p className="text-silver text-sm mt-0.5">This action cannot be undone</p>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-5">
                      <div className="p-4 rounded-xl bg-crimson/[0.08] border border-crimson/20 space-y-2">
                        {['All your profile data will be permanently deleted',
                          'Your virtual balance of $100,000+ will be lost',
                          'All trade history and AI preferences will be removed',
                          'This cannot be recovered — ever',
                        ].map((item) => (
                          <div key={item} className="flex items-start gap-2 text-sm text-silver">
                            <span className="text-crimson mt-0.5 flex-shrink-0">x</span>{item}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <button onClick={handleClose} className="btn-ghost flex-1 h-10 text-sm">Keep Account</button>
                        <button onClick={() => setStep(2)} className="btn-danger flex-1 h-10 text-sm">I understand, continue</button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-5">
                      <p className="text-silver text-sm">
                        To permanently delete your account, type{' '}
                        <span className="font-mono font-bold text-crimson tracking-widest">DELETE</span> in the field below.
                      </p>
                      <div className="relative">
                        <input type="text" value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Type DELETE to confirm"
                          autoFocus className={`input-base font-mono tracking-widest text-sm ${confirmed ? 'border-crimson shadow-crimson-sm text-crimson' : ''}`} />
                        {confirmed && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-1/2 -translate-y-1/2 text-crimson">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                          </motion.div>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setStep(1)} className="btn-ghost flex-1 h-10 text-sm">Go back</button>
                        <button disabled={!confirmed || loading} onClick={onConfirm}
                          className={`flex-1 h-10 rounded-xl text-sm font-semibold transition-all duration-300
                            ${confirmed && !loading ? 'bg-crimson text-white shadow-crimson-md hover:shadow-crimson-sm active:scale-[0.98]'
                              : 'bg-crimson/20 text-crimson/40 cursor-not-allowed'}`}>
                          {loading ? (
                            <span className="flex items-center justify-center gap-2">
                              <motion.span className="block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
                                animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                              Deleting...
                            </span>
                          ) : 'Delete My Account'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
