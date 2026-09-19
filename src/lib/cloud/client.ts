import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInAnonymously,
  signInWithCredential,
  signInWithPopup,
  linkWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDoc,
  writeBatch,
  enableIndexedDbPersistence,
} from 'firebase/firestore'
import { firebaseConfig } from './config'
import type { AppState, CheckIn, ChatMessage, Goal, Memory } from '../../types'
import type { CloudCallbacks, CloudUser } from './types'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const googleProvider = new GoogleAuthProvider()

enableIndexedDbPersistence(db).catch(() => {
  // multiple tabs open, or browser doesn't support it — Firestore still
  // works online, it just won't cache offline in that tab.
})

let currentUid: string | null = null
let unsubData: (() => void)[] = []

function toCloudUser(u: User): CloudUser {
  return { uid: u.uid, isAnonymous: u.isAnonymous, displayName: u.displayName, email: u.email }
}

function teardownDataSubscriptions() {
  unsubData.forEach((fn) => fn())
  unsubData = []
}

async function migrateLocalIfNeeded(uid: string, local: AppState) {
  const profileRef = doc(db, 'users', uid)
  const existing = await getDoc(profileRef)
  if (existing.exists()) return // this cloud identity already has data — never overwrite it

  const batch = writeBatch(db)
  batch.set(profileRef, {
    userName: local.userName,
    streak: local.streak,
    lastActiveDate: local.lastActiveDate,
  })
  local.memories.forEach((m) => batch.set(doc(db, 'users', uid, 'memories', m.id), m))
  local.goals.forEach((g) => batch.set(doc(db, 'users', uid, 'goals', g.id), g))
  local.checkIns.forEach((c) => batch.set(doc(db, 'users', uid, 'checkIns', c.id), c))
  local.messages.forEach((msg) => batch.set(doc(db, 'users', uid, 'messages', msg.id), msg))
  await batch.commit()
}

function subscribeUserData(uid: string, callbacks: CloudCallbacks) {
  teardownDataSubscriptions()
  unsubData = [
    onSnapshot(doc(db, 'users', uid), (snap) => callbacks.onProfile(snap.exists() ? (snap.data() as never) : null)),
    onSnapshot(collection(db, 'users', uid, 'memories'), (snap) =>
      callbacks.onMemories(snap.docs.map((d) => d.data() as Memory)),
    ),
    onSnapshot(collection(db, 'users', uid, 'goals'), (snap) =>
      callbacks.onGoals(snap.docs.map((d) => d.data() as Goal)),
    ),
    onSnapshot(collection(db, 'users', uid, 'checkIns'), (snap) =>
      callbacks.onCheckIns(snap.docs.map((d) => d.data() as CheckIn)),
    ),
    onSnapshot(collection(db, 'users', uid, 'messages'), (snap) =>
      callbacks.onMessages(snap.docs.map((d) => d.data() as ChatMessage)),
    ),
  ]
}

export function start(callbacks: CloudCallbacks, getLocalSnapshot: () => AppState) {
  callbacks.onStatus('connecting')
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      currentUid = null
      teardownDataSubscriptions()
      callbacks.onUser(null)
      callbacks.onStatus('connecting')
      signInAnonymously(auth).catch(() => callbacks.onStatus('local'))
      return
    }
    currentUid = user.uid
    callbacks.onUser(toCloudUser(user))
    try {
      await migrateLocalIfNeeded(user.uid, getLocalSnapshot())
    } catch {
      // non-fatal — subscriptions below still bring the account's existing data in
    }
    subscribeUserData(user.uid, callbacks)
    callbacks.onStatus('synced')
  })
}

export async function signInWithGoogle() {
  const current = auth.currentUser
  try {
    if (current?.isAnonymous) {
      await linkWithPopup(current, googleProvider)
    } else {
      await signInWithPopup(auth, googleProvider)
    }
  } catch (err) {
    const code = (err as { code?: string }).code
    if (code === 'auth/credential-already-in-use') {
      const credential = GoogleAuthProvider.credentialFromError(err as never)
      if (credential) await signInWithCredential(auth, credential)
    } else {
      throw err
    }
  }
}

export async function signOutCloud() {
  await signOut(auth)
}

function uidOr<T>(fn: (uid: string) => T): T | void {
  if (currentUid) return fn(currentUid)
}

export function cloudWriteMemory(memory: Memory) {
  uidOr((uid) => void setDoc(doc(db, 'users', uid, 'memories', memory.id), memory))
}
export function cloudDeleteMemory(id: string) {
  uidOr((uid) => void deleteDoc(doc(db, 'users', uid, 'memories', id)))
}
export function cloudWriteGoal(goal: Goal) {
  uidOr((uid) => void setDoc(doc(db, 'users', uid, 'goals', goal.id), goal))
}
export function cloudDeleteGoal(id: string) {
  uidOr((uid) => void deleteDoc(doc(db, 'users', uid, 'goals', id)))
}
export function cloudWriteCheckIn(checkIn: CheckIn) {
  uidOr((uid) => void setDoc(doc(db, 'users', uid, 'checkIns', checkIn.id), checkIn))
}
export function cloudWriteMessage(message: ChatMessage) {
  uidOr((uid) => void setDoc(doc(db, 'users', uid, 'messages', message.id), message))
}
export function cloudWriteProfile(data: Partial<{ userName: string; streak: number; lastActiveDate: string | null }>) {
  uidOr((uid) => void setDoc(doc(db, 'users', uid), data, { merge: true }))
}
