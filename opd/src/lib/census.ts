import type { Visit } from '../types'

export interface Census {
  total: number
  old: number
  newCount: number
  xray: number
  lab: number
  ecg: number
  totalInvestigations: number
  completed: number // doctor verified
  pending: number // registered, not yet verified
  notComing: number
  paid: number
  gpay: number
  free: number
  unpaid: number
}

/** The same numbers as the census block (columns U:V) in the old sheet. */
export function computeCensus(visits: Visit[]): Census {
  const active = visits.filter((v) => v.status !== 'not_coming')
  const count = (type: string) =>
    active.reduce((n, v) => n + v.investigations.filter((i) => i.type === type).length, 0)
  const xray = count('XRAY')
  const lab = count('LAB')
  const ecg = count('ECG')
  const completed = active.filter((v) => v.verifiedAt).length
  return {
    total: active.length,
    old: active.filter((v) => v.visitType === 'OLD').length,
    newCount: active.filter((v) => v.visitType === 'NEW').length,
    xray,
    lab,
    ecg,
    totalInvestigations: xray + lab + ecg,
    completed,
    pending: active.length - completed,
    notComing: visits.length - active.length,
    paid: active.filter((v) => v.payment === 'PAID').length,
    gpay: active.filter((v) => v.payment === 'GPAY').length,
    free: active.filter((v) => v.payment === 'DR FREE').length,
    unpaid: active.filter((v) => v.payment === 'UNPAID').length,
  }
}

/** One-line summary, same shape as the old push notification. */
export function summaryLine(sheetDate: string, c: Census): string {
  return `OPD ${sheetDate.slice(0, 5)}: ${c.total} logged — ${c.completed} verified, ${c.pending} pending.`
}
