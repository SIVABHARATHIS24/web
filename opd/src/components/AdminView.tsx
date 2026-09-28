import { useState } from 'react'
import { Copy, Download, MessageCircle } from 'lucide-react'
import { useDayVisits, useOpdStore } from '../store/useOpdStore'
import { computeCensus, summaryLine } from '../lib/census'
import { toSheetDate } from '../lib/date'
import { downloadCsv, visitsToCsv } from '../lib/exportCsv'
import { isFirebaseConfigured } from '../lib/cloud'
import { ROLES, type Role } from '../types'
import { Button, Card, Empty, StatusBadge, VerifiedBadge, VitalsLine } from './ui'

function Stat({ label, value, tone = 'text-slate-900' }: { label: string; value: number; tone?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className={`text-2xl font-bold tabular-nums ${tone}`}>{value}</div>
    </div>
  )
}

export function AdminView() {
  const date = useOpdStore((s) => s.date)
  const dayVisits = useDayVisits()
  const [copied, setCopied] = useState(false)

  const c = computeCensus(dayVisits)
  const sheetDate = toSheetDate(date)
  const summary = summaryLine(sheetDate, c)
  const detail = `${summary}\nOLD ${c.old} · NEW ${c.newCount} · XRAY ${c.xray} · LAB ${c.lab} · ECG ${c.ecg}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(detail)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable (e.g. insecure context) — the text is still on screen
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        <Stat label="Total OP" value={c.total} />
        <Stat label="Verified" value={c.completed} tone="text-emerald-700" />
        <Stat label="Pending" value={c.pending} tone="text-amber-700" />
        <Stat label="Old" value={c.old} />
        <Stat label="New" value={c.newCount} />
        <Stat label="Not coming" value={c.notComing} tone="text-slate-500" />
        <Stat label="Investigations" value={c.totalInvestigations} />
        <Stat label="X-ray" value={c.xray} />
        <Stat label="Lab" value={c.lab} />
        <Stat label="ECG" value={c.ecg} />
        <Stat label="Paid + GPay" value={c.paid + c.gpay} />
        <Stat label="Dr free" value={c.free} />
      </div>

      <Card title="Daily summary">
        <pre className="rounded-lg bg-slate-50 p-3 text-sm whitespace-pre-wrap text-slate-800">{detail}</pre>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={copy}>
            <Copy className="size-4" /> {copied ? 'Copied' : 'Copy'}
          </Button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(detail)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <MessageCircle className="size-4" /> Share on WhatsApp
          </a>
          <Button variant="secondary" onClick={() => downloadCsv(`OPD ${sheetDate}.csv`, visitsToCsv(dayVisits))} disabled={!dayVisits.length}>
            <Download className="size-4" /> Export for Google Sheet
          </Button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          The export uses the old sheet's columns (S, PATIENT NAME … SIGN). In Google Sheets: File → Import → Upload → "Insert new sheet", then rename the tab to {sheetDate}.
        </p>
      </Card>

      <Card title={`All patients · ${sheetDate}`}>
        {dayVisits.length === 0 ? (
          <Empty>No patients on this date.</Empty>
        ) : (
          <div className="-mx-4 overflow-x-auto px-4">
            <table className="w-full min-w-[48rem] text-left text-sm">
              <thead className="text-xs text-slate-500 uppercase">
                <tr>
                  <th className="py-2 pr-2">#</th>
                  <th className="py-2 pr-2">Patient</th>
                  <th className="py-2 pr-2">Visit</th>
                  <th className="py-2 pr-2">Vitals</th>
                  <th className="py-2 pr-2">Diagnosis</th>
                  <th className="py-2 pr-2">Status</th>
                  <th className="py-2">Sign</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dayVisits.map((v) => (
                  <tr key={v.id} className="align-top">
                    <td className="py-2 pr-2 text-slate-400">{v.token}</td>
                    <td className="py-2 pr-2">
                      <div className="font-medium">{v.name}</div>
                      <div className="text-xs text-slate-500">{v.age}{v.sex} · {v.address} · {v.contact}</div>
                    </td>
                    <td className="py-2 pr-2 text-xs">{v.visitType}<br />{v.payment}</td>
                    <td className="py-2 pr-2"><VitalsLine vitals={v.vitals} /></td>
                    <td className="py-2 pr-2 text-xs">{v.finalDx || v.provisionalDx}</td>
                    <td className="py-2 pr-2"><StatusBadge status={v.status} /></td>
                    <td className="py-2"><VerifiedBadge visit={v} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <StaffCard />
    </div>
  )
}

function StaffCard() {
  const staffList = useOpdStore((s) => s.staffList)
  const setStaffRole = useOpdStore((s) => s.setStaffRole)
  const me = useOpdStore((s) => s.me)

  if (!isFirebaseConfigured) {
    return (
      <Card title="Staff">
        <p className="text-sm text-slate-600">
          Running in single-device mode: data stays in this browser and anyone can switch roles. Connect Firebase (see the README) so
          reception, doctor, lab and pharmacy share live data from their own devices, with staff logins and roles.
        </p>
      </Card>
    )
  }

  const sorted = [...staffList].sort((a, b) => Number(a.role !== null) - Number(b.role !== null) || a.name.localeCompare(b.name))
  return (
    <Card title={`Staff (${staffList.length})`}>
      {sorted.length === 0 ? (
        <Empty>No staff yet.</Empty>
      ) : (
        <ul className="divide-y divide-slate-100">
          {sorted.map((s) => (
            <li key={s.uid} className="flex flex-wrap items-center justify-between gap-2 py-2">
              <div>
                <div className="text-sm font-medium">{s.name}</div>
                <div className="text-xs text-slate-500">{s.email}</div>
              </div>
              <select
                value={s.role ?? ''}
                disabled={s.uid === me?.uid}
                onChange={(e) => setStaffRole(s.uid, (e.target.value || null) as Role | null)}
                className={`rounded-lg border px-2 py-1.5 text-sm ${s.role ? 'border-slate-300' : 'border-amber-400 bg-amber-50'}`}
              >
                <option value="">No access (pending)</option>
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
