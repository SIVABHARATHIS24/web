import type { AuditEntry, Patient, Role, Visit } from '../../types'
import { isFirebaseConfigured } from './config'
import type { CloudCallbacks } from './types'

export { isFirebaseConfigured }
export type { CloudStatus } from './types'

type Client = typeof import('./client')

let clientPromise: Promise<Client> | null = null
function loadClient(): Promise<Client> {
  if (!clientPromise) clientPromise = import('./client')
  return clientPromise
}

export function startCloud(callbacks: CloudCallbacks, date: string) {
  if (!isFirebaseConfigured) return
  loadClient()
    .then((client) => client.start(callbacks, date))
    .catch(() => callbacks.onStatus('error'))
}

export function cloudWatchDate(date: string) {
  if (!isFirebaseConfigured) return
  loadClient().then((c) => c.watchDate(date))
}

export async function cloudSignIn(email: string, password: string) {
  return (await loadClient()).signIn(email, password)
}
export async function cloudSignUp(name: string, email: string, password: string) {
  return (await loadClient()).signUp(name, email, password)
}
export async function cloudSignOut() {
  return (await loadClient()).signOutCloud()
}

/** Assigns the next token for the day atomically, then writes the visit. */
export async function cloudCreateVisit(visit: Omit<Visit, 'token'>, patient: Patient): Promise<Visit> {
  return (await loadClient()).createVisit(visit, patient)
}
export function cloudPatchVisit(id: string, patch: Partial<Visit>, entry: AuditEntry) {
  if (!isFirebaseConfigured) return
  loadClient().then((c) => c.patchVisit(id, patch, entry))
}
export function cloudSetStaffRole(uid: string, role: Role | null) {
  if (!isFirebaseConfigured) return
  loadClient().then((c) => c.setStaffRole(uid, role))
}
