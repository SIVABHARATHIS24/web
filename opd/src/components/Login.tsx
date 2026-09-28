import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Stethoscope } from 'lucide-react'
import { cloudSignIn, cloudSignUp } from '../lib/cloud'
import { Button, Input } from './ui'

function message(err: unknown): string {
  const code = (err as { code?: string }).code ?? ''
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) return 'Wrong email or password.'
  if (code.includes('email-already-in-use')) return 'An account with this email already exists — sign in instead.'
  if (code.includes('weak-password')) return 'Password must be at least 6 characters.'
  if (code.includes('network')) return 'No internet connection.'
  return 'Something went wrong. Please try again.'
}

export function Login() {
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      if (mode === 'in') await cloudSignIn(email.trim(), password)
      else await cloudSignUp(name.trim(), email.trim(), password)
    } catch (err) {
      setError(message(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Shell>
      <form onSubmit={submit} className="space-y-3">
        {mode === 'up' && <Input label="Your name" value={name} onChange={(e) => setName(e.target.value)} required />}
        <Input label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" autoComplete={mode === 'in' ? 'current-password' : 'new-password'} value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="text-xs font-medium text-rose-700">{error}</p>}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? 'Please wait…' : mode === 'in' ? 'Sign in' : 'Create staff account'}
        </Button>
      </form>
      <button type="button" onClick={() => setMode(mode === 'in' ? 'up' : 'in')} className="mt-4 w-full text-center text-sm text-brand-700">
        {mode === 'in' ? 'New staff member? Create an account' : 'Already have an account? Sign in'}
      </button>
    </Shell>
  )
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <div className="rounded-xl bg-brand-600 p-2 text-white"><Stethoscope className="size-5" /></div>
          <div>
            <div className="font-bold text-slate-900">OPD</div>
            <div className="text-xs text-slate-500">Out-patient clinic</div>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
