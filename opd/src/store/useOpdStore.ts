import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  cloudCreateVisit,
  cloudSetStaffRole,
  cloudSignOut,
  cloudWatchDate,
  cloudWriteVisit,
  isFirebaseConfigured,
  startCloud,
  type CloudStatus,
} from '../lib/cloud'
import { todayIST } from '../lib/date'
import { makeId } from '../lib/id'
import type {
  Investigation,
  Patient,
  Payment,
  Role,
  RxItem,
  Sex,
  StaffMember,
  Visit,
  VisitStatus,
  Vitals,
} from '../types'

export interface RegisterInput {
  patientId: string | null // existing patient, or null to create one
  name: string
  contact: string
  age: string
  sex: Sex
  address: string
  comorbidities: string[]
  payment: Payment
  amount: string
  vitals: Vitals
  notes: string
}

interface OpdState {
  /** Local mode: the role picked on this device. Cloud mode: comes from the staff doc. */
  role: Role | null
  staffName: string
  date: string
  patients: Patient[]
  visits: Visit[]
  cloudStatus: CloudStatus
  me: StaffMember | null
  staffList: StaffMember[]
}

interface OpdActions {
  setRole: (role: Role | null) => void
  setStaffName: (name: string) => void
  setDate: (date: string) => void
  registerVisit: (input: RegisterInput) => Promise<Visit>
  updateVisit: (id: string, patch: Partial<Visit>, action: string) => void
  setStatus: (id: string, status: VisitStatus) => void
  orderInvestigations: (id: string, investigations: Investigation[]) => void
  recordResult: (visitId: string, invId: string, result: string) => void
  verify: (id: string) => void
  dispense: (id: string) => void
  setStaffRole: (uid: string, role: Role | null) => void
  initCloud: () => void
  signOut: () => Promise<void>
}

export const emptyVitals: Vitals = { bp: '', pr: '', spo2: '', wt: '', temp: '' }

export function newRxItem(): RxItem {
  return { id: makeId(), drug: '', dose: '', frequency: '', days: '' }
}

function now() {
  return new Date().toISOString()
}

export const useOpdStore = create<OpdState & OpdActions>()(
  persist(
    (set, get) => {
      const actor = () => get().me?.name || get().staffName || get().role || 'staff'

      const saveVisit = (visit: Visit) => {
        set((s) => ({ visits: s.visits.map((v) => (v.id === visit.id ? visit : v)) }))
        cloudWriteVisit(visit)
      }

      const mutate = (id: string, fn: (v: Visit) => Partial<Visit>, action: string) => {
        const current = get().visits.find((v) => v.id === id)
        if (!current) return
        const at = now()
        saveVisit({
          ...current,
          ...fn(current),
          updatedAt: at,
          audit: [...current.audit, { at, by: actor(), action }],
        })
      }

      return {
        role: null,
        staffName: '',
        date: todayIST(),
        patients: [],
        visits: [],
        cloudStatus: isFirebaseConfigured ? 'connecting' : 'unconfigured',
        me: null,
        staffList: [],

        setRole: (role) => set({ role }),
        setStaffName: (staffName) => set({ staffName: staffName.trim() }),
        setDate: (date) => {
          set({ date })
          cloudWatchDate(date)
        },

        registerVisit: async (input) => {
          const s = get()
          const at = now()
          const existing = input.patientId ? s.patients.find((p) => p.id === input.patientId) : undefined
          const patient: Patient = {
            id: existing?.id ?? makeId(),
            name: input.name.trim(),
            contact: input.contact.trim(),
            age: input.age.trim(),
            sex: input.sex,
            address: input.address.trim(),
            comorbidities: input.comorbidities,
            visitCount: (existing?.visitCount ?? 0) + 1,
            lastVisitDate: s.date,
            createdAt: existing?.createdAt ?? at,
          }
          const base: Omit<Visit, 'token'> = {
            id: makeId(),
            date: s.date,
            patientId: patient.id,
            name: patient.name,
            contact: patient.contact,
            age: patient.age,
            sex: patient.sex,
            address: patient.address,
            visitType: existing && existing.visitCount > 0 ? 'OLD' : 'NEW',
            payment: input.payment,
            amount: input.amount,
            vitals: input.vitals,
            comorbidities: input.comorbidities,
            provisionalDx: '',
            investigations: [],
            finalDx: '',
            treatment: [],
            advice: '',
            notes: input.notes,
            status: 'waiting',
            verifiedBy: null,
            verifiedAt: null,
            dispensedBy: null,
            dispensedAt: null,
            createdAt: at,
            updatedAt: at,
            audit: [{ at, by: actor(), action: 'Registered' }],
          }

          let visit: Visit
          if (isFirebaseConfigured) {
            visit = await cloudCreateVisit(base, patient)
          } else {
            const token = s.visits.filter((v) => v.date === s.date).reduce((m, v) => Math.max(m, v.token), 0) + 1
            visit = { ...base, token }
          }
          set((st) => ({
            patients: [...st.patients.filter((p) => p.id !== patient.id), patient],
            visits: [...st.visits.filter((v) => v.id !== visit.id), visit],
          }))
          return visit
        },

        updateVisit: (id, patch, action) => mutate(id, () => patch, action),

        setStatus: (id, status) => mutate(id, () => ({ status }), `Status → ${status}`),

        orderInvestigations: (id, investigations) =>
          mutate(
            id,
            (v) => ({
              investigations: [...v.investigations, ...investigations],
              status: 'investigations',
            }),
            `Ordered ${investigations.map((i) => i.type).join(', ')}`,
          ),

        recordResult: (visitId, invId, result) =>
          mutate(
            visitId,
            (v) => {
              const investigations = v.investigations.map((i) =>
                i.id === invId ? { ...i, result, done: true, doneAt: now() } : i,
              )
              const allDone = investigations.every((i) => i.done)
              return {
                investigations,
                // Once every test is back, the patient returns to the doctor.
                status: allDone && v.status === 'investigations' ? 'review' : v.status,
              }
            },
            'Result recorded',
          ),

        verify: (id) =>
          mutate(
            id,
            (v) => ({
              verifiedBy: actor(),
              verifiedAt: now(),
              status: v.treatment.some((t) => t.drug.trim()) ? 'pharmacy' : 'completed',
            }),
            'Verified by doctor',
          ),

        dispense: (id) =>
          mutate(id, () => ({ dispensedBy: actor(), dispensedAt: now(), status: 'completed' }), 'Medicines dispensed'),

        setStaffRole: (uid, role) => cloudSetStaffRole(uid, role),

        initCloud: () => {
          if (!isFirebaseConfigured) return
          startCloud(
            {
              onStatus: (cloudStatus) => set({ cloudStatus }),
              onStaff: (me) => set({ me, role: me?.role ?? null }),
              onPatients: (patients) => set({ patients }),
              onVisits: (visits) => set({ visits }),
              onStaffList: (staffList) => set({ staffList }),
            },
            get().date,
          )
        },

        signOut: async () => {
          if (isFirebaseConfigured) await cloudSignOut()
          set({ role: null })
        },
      }
    },
    {
      name: 'opd-store',
      // In cloud mode Firestore is the source of truth (with its own offline
      // cache), so only device preferences are kept in localStorage.
      partialize: (s) =>
        isFirebaseConfigured
          ? { staffName: s.staffName }
          : { role: s.role, staffName: s.staffName, patients: s.patients, visits: s.visits },
    },
  ),
)

/** Visits for the selected date, in token order. */
export function useDayVisits(): Visit[] {
  const visits = useOpdStore((s) => s.visits)
  const date = useOpdStore((s) => s.date)
  return visits.filter((v) => v.date === date).sort((a, b) => a.token - b.token)
}
