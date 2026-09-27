import type { Vitals } from '../types'

export interface VitalFlag {
  field: keyof Vitals
  message: string
}

function num(v: string): number | null {
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : null
}

/**
 * Flags values that are clinically concerning or look like typing mistakes
 * (e.g. SpO2 66 when 96 was meant). Warnings only — nothing is blocked.
 */
export function vitalFlags(v: Vitals): VitalFlag[] {
  const flags: VitalFlag[] = []

  if (v.bp.trim()) {
    const m = v.bp.match(/^\s*(\d{2,3})\s*\/\s*(\d{2,3})\s*$/)
    if (!m) {
      flags.push({ field: 'bp', message: 'BP should look like 120/80' })
    } else {
      const sys = Number(m[1])
      const dia = Number(m[2])
      if (sys >= 180 || dia >= 110) flags.push({ field: 'bp', message: `BP ${sys}/${dia} — severe hypertension` })
      else if (sys >= 160 || dia >= 100) flags.push({ field: 'bp', message: `BP ${sys}/${dia} — high` })
      else if (sys < 90) flags.push({ field: 'bp', message: `BP ${sys}/${dia} — low` })
      if (dia >= sys) flags.push({ field: 'bp', message: 'Diastolic is not lower than systolic — check entry' })
    }
  }

  const pr = num(v.pr)
  if (pr !== null && (pr < 50 || pr > 110)) flags.push({ field: 'pr', message: `Pulse ${pr} — out of range` })

  const spo2 = num(v.spo2)
  if (spo2 !== null) {
    if (spo2 > 100) flags.push({ field: 'spo2', message: 'SpO2 cannot exceed 100' })
    else if (spo2 < 80) flags.push({ field: 'spo2', message: `SpO2 ${spo2} — very low, re-check (typo?)` })
    else if (spo2 < 94) flags.push({ field: 'spo2', message: `SpO2 ${spo2} — low` })
  }

  const temp = num(v.temp)
  if (temp !== null) {
    if (temp >= 100.4) flags.push({ field: 'temp', message: `Temp ${temp}°F — fever` })
    else if (temp < 95) flags.push({ field: 'temp', message: `Temp ${temp}°F — check entry` })
  }

  return flags
}
