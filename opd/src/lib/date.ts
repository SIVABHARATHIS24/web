const IST = 'Asia/Kolkata'

/** Today's date as YYYY-MM-DD in the clinic's timezone. */
export function todayIST(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: IST }).format(new Date())
}

/** 2026-09-27 -> 27.09.2026, the tab name format used in the old sheet. */
export function toSheetDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

export function formatTime(iso: string | null): string {
  if (!iso) return ''
  return new Intl.DateTimeFormat('en-IN', { timeZone: IST, hour: 'numeric', minute: '2-digit' }).format(new Date(iso))
}
