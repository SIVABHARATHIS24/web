import { useState } from 'react'
import { Cloud, CloudOff, LogOut, User } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export function AccountMenu() {
  const cloudStatus = useAppStore((s) => s.cloudStatus)
  const cloudUser = useAppStore((s) => s.cloudUser)
  const signInWithGoogle = useAppStore((s) => s.signInWithGoogle)
  const signOutCloud = useAppStore((s) => s.signOutCloud)
  const [busy, setBusy] = useState(false)

  if (cloudStatus === 'unconfigured') return null

  if (cloudStatus === 'connecting') {
    return <span className="text-[11px] text-slate-500">Connecting…</span>
  }

  if (cloudStatus === 'local') {
    return (
      <span className="flex items-center gap-1 text-[11px] text-slate-500" title="Cloud sync unavailable — saving locally">
        <CloudOff size={13} /> Local only
      </span>
    )
  }

  const isLinked = !!cloudUser && !cloudUser.isAnonymous

  async function handleClick() {
    setBusy(true)
    try {
      if (isLinked) {
        await signOutCloud()
      } else {
        await signInWithGoogle()
      }
    } catch {
      // popup closed or blocked — nothing to recover, user can retry
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:bg-white/10 disabled:opacity-50"
      title={isLinked ? `Signed in as ${cloudUser?.displayName || cloudUser?.email}` : 'Sign in with Google to sync across devices'}
    >
      {isLinked ? (
        <>
          <User size={13} className="text-brand-300" />
          <span className="max-w-[100px] truncate">{cloudUser?.displayName || cloudUser?.email}</span>
          <LogOut size={12} />
        </>
      ) : (
        <>
          <Cloud size={13} className="text-brand-300" />
          Sync across devices
        </>
      )}
    </button>
  )
}
