import { useEffect, useRef, useState } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export function ChatView() {
  const messages = useAppStore((s) => s.messages)
  const sendMessage = useAppStore((s) => s.sendMessage)
  const userName = useAppStore((s) => s.userName)
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  function handleSend() {
    if (!input.trim()) return
    sendMessage(input)
    setInput('')
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                  m.role === 'user'
                    ? 'rounded-br-sm bg-brand-500 text-white'
                    : 'rounded-bl-sm bg-white/10 text-slate-100'
                }`}
              >
                {m.role === 'assistant' && m.memoryIds && m.memoryIds.length > 0 && (
                  <div className="mb-1 flex items-center gap-1 text-[11px] font-medium text-brand-300">
                    <Sparkles size={12} /> saved to memory
                  </div>
                )}
                {m.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </div>
      <div className="border-t border-white/10 bg-black/20 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend()
            }}
            placeholder={userName ? `What's on your mind, ${userName}?` : "Tell me what's on your mind..."}
            className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-400 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white transition hover:bg-brand-600 disabled:opacity-40"
            aria-label="Send"
          >
            <Send size={17} />
          </button>
        </div>
        <p className="mx-auto mt-2 max-w-2xl text-center text-[11px] text-slate-500">
          Try "I want to run a 5k" or "Remember that I prefer morning workouts"
        </p>
      </div>
    </div>
  )
}
