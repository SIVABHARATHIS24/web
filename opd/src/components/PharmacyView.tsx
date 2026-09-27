import { useState } from 'react'
import { PackageCheck, Printer } from 'lucide-react'
import { useDayVisits, useOpdStore } from '../store/useOpdStore'
import { formatTime, toSheetDate } from '../lib/date'
import type { Visit } from '../types'
import { Button, Card, Empty } from './ui'

export function PharmacyView() {
  const dayVisits = useDayVisits()
  const dispense = useOpdStore((s) => s.dispense)
  const [printing, setPrinting] = useState<Visit | null>(null)

  const queue = dayVisits.filter((v) => v.status === 'pharmacy')
  const dispensed = dayVisits.filter((v) => v.dispensedAt)

  const print = (v: Visit) => {
    setPrinting(v)
    // Let React render the printable slip before opening the print dialog.
    requestAnimationFrame(() => window.print())
  }

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2 print:hidden">
        <Card title={`To dispense (${queue.length})`}>
          {queue.length === 0 ? (
            <Empty>No prescriptions waiting.</Empty>
          ) : (
            <ul className="space-y-3">
              {queue.map((v) => (
                <li key={v.id} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">
                      <span className="text-slate-400">#{v.token}</span> {v.name} <span className="font-normal text-slate-500">· {v.age}{v.sex}</span>
                    </span>
                    <span className="text-xs text-slate-500">Dr: {v.verifiedBy}</span>
                  </div>
                  {v.finalDx && <div className="mt-1 text-xs text-slate-500">Dx: {v.finalDx}</div>}
                  <Rx visit={v} />
                  <div className="mt-3 flex gap-2">
                    <Button onClick={() => dispense(v.id)}>
                      <PackageCheck className="size-4" /> Dispensed
                    </Button>
                    <Button variant="secondary" onClick={() => print(v)}>
                      <Printer className="size-4" /> Print
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title={`Dispensed (${dispensed.length})`}>
          {dispensed.length === 0 ? (
            <Empty>Nothing dispensed yet.</Empty>
          ) : (
            <ul className="divide-y divide-slate-100">
              {dispensed.map((v) => (
                <li key={v.id} className="flex items-center justify-between gap-2 py-2 text-sm">
                  <span>
                    <span className="text-slate-400">#{v.token}</span> {v.name}
                    <span className="text-xs text-slate-500"> · {v.treatment.length} item{v.treatment.length === 1 ? '' : 's'} · {formatTime(v.dispensedAt)}</span>
                  </span>
                  <Button variant="ghost" title="Print prescription" onClick={() => print(v)}>
                    <Printer className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
      {printing && <PrintSlip visit={printing} />}
    </>
  )
}

function Rx({ visit }: { visit: Visit }) {
  return (
    <table className="mt-2 w-full text-left text-sm">
      <tbody>
        {visit.treatment.map((t) => (
          <tr key={t.id} className="border-t border-slate-100">
            <td className="py-1 pr-2 font-medium">{t.drug}</td>
            <td className="py-1 pr-2">{t.dose}</td>
            <td className="py-1 pr-2">{t.frequency}</td>
            <td className="py-1">{t.days && `${t.days} days`}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function PrintSlip({ visit }: { visit: Visit }) {
  return (
    <div className="hidden bg-white p-8 text-black print:block">
      <h1 className="text-xl font-bold">Prescription</h1>
      <p className="text-sm">
        {toSheetDate(visit.date)} · Token #{visit.token}
      </p>
      <p className="mt-3 text-sm">
        <strong>{visit.name}</strong> · {visit.age} / {visit.sex} · {visit.address}
      </p>
      {visit.finalDx && <p className="mt-2 text-sm">Diagnosis: {visit.finalDx}</p>}
      <Rx visit={visit} />
      {visit.advice && <p className="mt-3 text-sm">Advice: {visit.advice}</p>}
      <p className="mt-8 text-right text-sm">{visit.verifiedBy}</p>
    </div>
  )
}
