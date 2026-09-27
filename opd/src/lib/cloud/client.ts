import { initializeApp } from 'firebase/app'
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import {
  collection,
  connectFirestoreEmulator,
  doc,
  initializeFirestore,
  onSnapshot,
  persistentLocalCache,
  persistentMultipleTabManager,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import type { Patient, Role, StaffMember, Visit } from '../../types'
import { firebaseConfig } from './config'
import type { CloudCallbacks } from './types'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
// Offline cache so reception keeps working through short network drops.
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
})
// Local testing against `npm run emulators` instead of the real project.
if (import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
}

let callbacks: CloudCallbacks | null = null
let watchedDate = ''
let unsubStaff: (() => void) | null = null
let unsubData: (() => void)[] = []
let unsubVisits: (() => void) | null = null

function teardown() {
  unsubData.forEach((fn) => fn())
  unsubData = []
  unsubVisits?.()
  unsubVisits = null
}

function subscribeVisits() {
  unsubVisits?.()
  unsubVisits = null
  if (!callbacks || !watchedDate) return
  const cb = callbacks
  unsubVisits = onSnapshot(query(collection(db, 'visits'), where('date', '==', watchedDate)), (snap) =>
    cb.onVisits(snap.docs.map((d) => d.data() as Visit)),
  )
}

function subscribeData(role: Role) {
  if (!callbacks) return
  const cb = callbacks
  teardown()
  unsubData.push(
    onSnapshot(collection(db, 'patients'), (snap) => cb.onPatients(snap.docs.map((d) => d.data() as Patient))),
  )
  if (role === 'admin') {
    unsubData.push(
      onSnapshot(collection(db, 'staff'), (snap) => cb.onStaffList(snap.docs.map((d) => d.data() as StaffMember))),
    )
  }
  subscribeVisits()
}

export function start(cb: CloudCallbacks, date: string) {
  callbacks = cb
  watchedDate = date
  cb.onStatus('connecting')
  onAuthStateChanged(auth, (user) => {
    unsubStaff?.()
    unsubStaff = null
    teardown()
    if (!user) {
      cb.onStaff(null)
      cb.onStatus('signed_out')
      return
    }
    // The staff doc carries the role an admin assigned; data access follows it.
    unsubStaff = onSnapshot(
      doc(db, 'staff', user.uid),
      (snap) => {
        const me = snap.exists() ? (snap.data() as StaffMember) : null
        cb.onStaff(me)
        if (me?.role) {
          subscribeData(me.role)
          cb.onStatus('synced')
        } else {
          teardown()
          cb.onStatus('synced')
        }
      },
      () => cb.onStatus('error'),
    )
  })
}

export function watchDate(date: string) {
  watchedDate = date
  if (unsubVisits) subscribeVisits()
}

export async function signIn(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email, password)
}

export async function signUp(name: string, email: string, password: string) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(user, { displayName: name })
  const me: StaffMember = { uid: user.uid, name, email, role: null }
  await setDoc(doc(db, 'staff', user.uid), me)
}

export async function signOutCloud() {
  await signOut(auth)
}

export async function createVisit(visit: Omit<Visit, 'token'>, patient: Patient): Promise<Visit> {
  const counterRef = doc(db, 'counters', visit.date)
  return runTransaction(db, async (tx) => {
    const counter = await tx.get(counterRef)
    const token = (counter.exists() ? (counter.data().last as number) : 0) + 1
    const full: Visit = { ...visit, token }
    tx.set(counterRef, { last: token })
    tx.set(doc(db, 'patients', patient.id), patient)
    tx.set(doc(db, 'visits', full.id), full)
    return full
  })
}

export function writeVisit(visit: Visit) {
  void setDoc(doc(db, 'visits', visit.id), visit)
}

export function setStaffRole(uid: string, role: Role | null) {
  void updateDoc(doc(db, 'staff', uid), { role })
}
