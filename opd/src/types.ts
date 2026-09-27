export type Role = 'reception' | 'doctor' | 'investigations' | 'pharmacy' | 'admin'

export const ROLES: { id: Role; label: string }[] = [
  { id: 'reception', label: 'Reception' },
  { id: 'doctor', label: 'Doctor' },
  { id: 'investigations', label: 'Investigations' },
  { id: 'pharmacy', label: 'Pharmacy' },
  { id: 'admin', label: 'Admin' },
]

export type Sex = 'M' | 'F' | 'MCH' | 'FCH'
export type Payment = 'PAID' | 'GPAY' | 'DR FREE' | 'UNPAID'
export type InvestigationType = 'XRAY' | 'LAB' | 'ECG'

export const COMORBIDITIES = [
  'NO COMORBIDITIES',
  'Type 2 DIABETES MELLITUS',
  'SYSTEMIC HYPERTENSION',
  'HYPOTHYROID',
  'BRONCHIAL ASTHMA',
  'CAD',
  'CKD',
  'OTHERS',
] as const

/**
 * Where a visit is in the clinic flow. `verified` in the old sheet maps to the
 * doctor signing off, which moves a visit to pharmacy (or completed when no
 * medicines were prescribed).
 */
export type VisitStatus =
  | 'waiting' // registered at reception, waiting for doctor
  | 'investigations' // doctor ordered tests, waiting on results
  | 'review' // results ready, back with doctor
  | 'pharmacy' // doctor verified, medicines to dispense
  | 'completed'
  | 'not_coming'

export const STATUS_LABEL: Record<VisitStatus, string> = {
  waiting: 'Waiting for doctor',
  investigations: 'Investigations',
  review: 'Results ready',
  pharmacy: 'Pharmacy',
  completed: 'Completed',
  not_coming: 'Not coming',
}

export interface Patient {
  id: string
  name: string
  contact: string
  age: string
  sex: Sex
  address: string
  comorbidities: string[]
  visitCount: number
  lastVisitDate: string | null
  createdAt: string
}

export interface Vitals {
  bp: string
  pr: string
  spo2: string
  wt: string
  temp: string
}

export interface Investigation {
  id: string
  type: InvestigationType
  name: string
  done: boolean
  result: string
  doneAt: string | null
}

export interface RxItem {
  id: string
  drug: string
  dose: string
  frequency: string
  days: string
}

export interface AuditEntry {
  at: string
  by: string
  action: string
}

export interface Visit {
  id: string
  date: string // YYYY-MM-DD in Asia/Kolkata
  token: number
  patientId: string
  // Snapshot of patient details at the time of the visit.
  name: string
  contact: string
  age: string
  sex: Sex
  address: string
  visitType: 'NEW' | 'OLD'
  payment: Payment
  amount: string
  vitals: Vitals
  comorbidities: string[]
  provisionalDx: string
  investigations: Investigation[]
  finalDx: string
  treatment: RxItem[]
  advice: string
  notes: string
  status: VisitStatus
  verifiedBy: string | null
  verifiedAt: string | null
  dispensedBy: string | null
  dispensedAt: string | null
  createdAt: string
  updatedAt: string
  audit: AuditEntry[]
}

export interface StaffMember {
  uid: string
  name: string
  email: string
  role: Role | null // null = signed up, waiting for an admin to assign a role
}
