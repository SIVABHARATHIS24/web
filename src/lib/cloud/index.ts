import type { AppState, CheckIn, ChatMessage, Goal, Memory } from '../../types'
import { isFirebaseConfigured } from './config'
import type { CloudCallbacks } from './types'

export { isFirebaseConfigured }
export type { CloudUser, CloudStatus, CloudProfile } from './types'

type Client = typeof import('./client')

let clientPromise: Promise<Client> | null = null
function loadClient(): Promise<Client> {
  if (!clientPromise) clientPromise = import('./client')
  return clientPromise
}

export function startCloud(callbacks: CloudCallbacks, getLocalSnapshot: () => AppState) {
  if (!isFirebaseConfigured) return
  loadClient()
    .then((client) => client.start(callbacks, getLocalSnapshot))
    .catch(() => callbacks.onStatus('local'))
}

export async function signInWithGoogle() {
  const client = await loadClient()
  await client.signInWithGoogle()
}

export async function signOutCloud() {
  const client = await loadClient()
  await client.signOutCloud()
}

export function cloudWriteMemory(memory: Memory) {
  if (!isFirebaseConfigured) return
  loadClient().then((c) => c.cloudWriteMemory(memory))
}
export function cloudDeleteMemory(id: string) {
  if (!isFirebaseConfigured) return
  loadClient().then((c) => c.cloudDeleteMemory(id))
}
export function cloudWriteGoal(goal: Goal) {
  if (!isFirebaseConfigured) return
  loadClient().then((c) => c.cloudWriteGoal(goal))
}
export function cloudDeleteGoal(id: string) {
  if (!isFirebaseConfigured) return
  loadClient().then((c) => c.cloudDeleteGoal(id))
}
export function cloudWriteCheckIn(checkIn: CheckIn) {
  if (!isFirebaseConfigured) return
  loadClient().then((c) => c.cloudWriteCheckIn(checkIn))
}
export function cloudWriteMessage(message: ChatMessage) {
  if (!isFirebaseConfigured) return
  loadClient().then((c) => c.cloudWriteMessage(message))
}
export function cloudWriteProfile(data: Partial<{ userName: string; streak: number; lastActiveDate: string | null }>) {
  if (!isFirebaseConfigured) return
  loadClient().then((c) => c.cloudWriteProfile(data))
}
