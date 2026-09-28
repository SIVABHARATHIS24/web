import type { Visit } from '../types'

const HEADERS = [
  'S', 'PATIENT NAME', 'VISIT', 'PAID', 'CONTACT', 'AGE', 'SEX', 'ADDRESS', 'BP', 'PR', 'SPO2', 'WT',
  'COMORBIDITIES', 'PROVISIONAL DIAGNOSIS', 'INVESTIGATIONS', 'FINAL DIAGNOSIS', 'TREATMENT',
  'ADDITIONAL INFORMATION', 'SIGN',
]

function cell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
}

function sign(v: Visit): string {
  if (v.status === 'not_coming') return 'NOT COMING'
  return v.verifiedAt ? 'VERIFIED' : 'NOT VERIFIED'
}

/**
 * CSV in the old sheet's column layout, so a day can be pasted or imported
 * into the existing Google Sheet (File → Import) as a new tab.
 */
export function visitsToCsv(visits: Visit[]): string {
  const rows = [...visits]
    .sort((a, b) => a.token - b.token)
    .map((v) => {
      const extra = [v.vitals.temp && `Temp-${v.vitals.temp}`, v.advice, v.notes].filter(Boolean).join('; ')
      return [
        String(v.token),
        v.name,
        v.visitType,
        v.payment,
        v.contact,
        v.age,
        v.sex,
        v.address,
        v.vitals.bp,
        v.vitals.pr,
        v.vitals.spo2,
        v.vitals.wt,
        v.comorbidities.join(', '),
        v.provisionalDx,
        v.investigations.map((i) => (i.name ? `${i.type}: ${i.name}` : i.type)).join(', '),
        v.finalDx,
        v.treatment.map((t) => [t.drug, t.dose, t.frequency, t.days && `${t.days}d`].filter(Boolean).join(' ')).join('; '),
        extra,
        sign(v),
      ]
    })
  return [HEADERS, ...rows].map((r) => r.map(cell).join(',')).join('\n')
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
