import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { makeId } from '../lib/id'
import { detectMemory, generateReply } from '../lib/localAssistant'
import {
  cloudDeleteGoal,
  cloudDeleteMemory,
  cloudWriteCheckIn,
  cloudWriteGoal,
  cloudWriteMemory,
  cloudWriteMessage,
  cloudWriteProfile,
  isFirebaseConfigured,
  signInWithGoogle as cloudSignInWithGoogle,
  signOutCloud as cloudSignOutCloud,
  startCloud,
  type CloudStatus,
  type CloudUser,
} from '../lib/cloud'
import type { AppState, ChatMessage, CheckIn, Goal, Memory, MemoryKind, Milestone } from '../types'

function isoToday(): string {
  return new Date().toISOString().slice(0, 10)
}

function computeStreak(lastActiveDate: string | null, currentStreak: number): number {
  if (!lastActiveDate) return 1
  const today = isoToday()
  if (lastActiveDate === today) return currentStreak || 1
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  if (lastActiveDate === yesterday) return (currentStreak || 0) + 1
  return 1
}

function byCreatedAtDesc<T extends { createdAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

interface CloudSlice {
  cloudStatus: CloudStatus
  cloudUser: CloudUser | null
}

interface AppActions {
  setUserName: (name: string) => void
  sendMessage: (text: string) => void
  addMemory: (text: string, kind: MemoryKind, tags?: string[]) => void
  removeMemory: (id: string) => void
  togglePinMemory: (id: string) => void
  addGoal: (title: string, why: string, targetDate?: string) => void
  removeGoal: (id: string) => void
  setGoalStatus: (id: string, status: Goal['status']) => void
  addMilestone: (goalId: string, text: string) => void
  toggleMilestone: (goalId: string, milestoneId: string) => void
  addCheckIn: (mood: number, energy: number, note: string) => void
  touchActivity: () => void
  resetAll: () => void
  initCloud: () => void
  signInWithGoogle: () => Promise<void>
  signOutCloud: () => Promise<void>
}

const initialState: AppState = {
  userName: '',
  memories: [],
  messages: [
    {
      id: makeId(),
      role: 'assistant',
      text: "Hi, I'm your assistant. I'll remember what matters to you and help you track your growth over time. What should I call you?",
      createdAt: new Date().toISOString(),
    },
  ],
  goals: [],
  checkIns: [],
  lastActiveDate: null,
  streak: 0,
}

const initialCloud: CloudSlice = {
  cloudStatus: isFirebaseConfigured ? 'connecting' : 'unconfigured',
  cloudUser: null,
}

export const useAppStore = create<AppState & AppActions & CloudSlice>()(
  persist(
    (set, get) => ({
      ...initialState,
      ...initialCloud,

      setUserName: (name) => {
        const userName = name.trim()
        set({ userName })
        cloudWriteProfile({ userName })
      },

      touchActivity: () =>
        set((s) => {
          const streak = computeStreak(s.lastActiveDate, s.streak)
          const lastActiveDate = isoToday()
          cloudWriteProfile({ streak, lastActiveDate })
          return { streak, lastActiveDate }
        }),

      sendMessage: (text) => {
        const trimmed = text.trim()
        if (!trimmed) return
        get().touchActivity()

        const userMsg: ChatMessage = {
          id: makeId(),
          role: 'user',
          text: trimmed,
          createdAt: new Date().toISOString(),
        }

        let savedMemory: Memory | null = null
        const detected = detectMemory(trimmed)
        if (detected) {
          savedMemory = {
            id: makeId(),
            text: detected.text,
            kind: detected.kind,
            tags: detected.tags,
            createdAt: new Date().toISOString(),
            pinned: false,
            source: 'chat',
          }
        }

        // handle "what should I call you" onboarding flow
        const state = get()
        const isFirstReal = state.messages.filter((m) => m.role === 'user').length === 0
        if (isFirstReal && !state.userName && trimmed.split(' ').length <= 4) {
          const userName = trimmed.replace(/^(i'?m|call me|my name is)\s+/i, '').trim()
          set({ userName })
          cloudWriteProfile({ userName })
        }

        const reply = generateReply(trimmed, {
          memories: state.memories,
          goals: state.goals,
          checkIns: state.checkIns,
          streak: state.streak,
          userName: get().userName,
        }, detected)

        const assistantMsg: ChatMessage = {
          id: makeId(),
          role: 'assistant',
          text: reply,
          createdAt: new Date().toISOString(),
          memoryIds: savedMemory ? [savedMemory.id] : undefined,
        }

        set((s) => ({
          messages: [...s.messages, userMsg, assistantMsg],
          memories: savedMemory ? [savedMemory, ...s.memories] : s.memories,
        }))

        cloudWriteMessage(userMsg)
        cloudWriteMessage(assistantMsg)
        if (savedMemory) cloudWriteMemory(savedMemory)
      },

      addMemory: (text, kind, tags = []) => {
        const memory: Memory = {
          id: makeId(),
          text: text.trim(),
          kind,
          tags,
          createdAt: new Date().toISOString(),
          pinned: false,
          source: 'manual',
        }
        set((s) => ({ memories: [memory, ...s.memories] }))
        cloudWriteMemory(memory)
      },

      removeMemory: (id) => {
        set((s) => ({ memories: s.memories.filter((m) => m.id !== id) }))
        cloudDeleteMemory(id)
      },

      togglePinMemory: (id) => {
        set((s) => ({
          memories: s.memories.map((m) => (m.id === id ? { ...m, pinned: !m.pinned } : m)),
        }))
        const updated = get().memories.find((m) => m.id === id)
        if (updated) cloudWriteMemory(updated)
      },

      addGoal: (title, why, targetDate) => {
        const goal: Goal = {
          id: makeId(),
          title: title.trim(),
          why: why.trim(),
          status: 'active',
          createdAt: new Date().toISOString(),
          targetDate,
          milestones: [],
        }
        set((s) => ({ goals: [goal, ...s.goals] }))
        cloudWriteGoal(goal)
      },

      removeGoal: (id) => {
        set((s) => ({ goals: s.goals.filter((g) => g.id !== id) }))
        cloudDeleteGoal(id)
      },

      setGoalStatus: (id, status) => {
        set((s) => ({ goals: s.goals.map((g) => (g.id === id ? { ...g, status } : g)) }))
        const updated = get().goals.find((g) => g.id === id)
        if (updated) cloudWriteGoal(updated)
      },

      addMilestone: (goalId, text) => {
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === goalId
              ? { ...g, milestones: [...g.milestones, { id: makeId(), text: text.trim(), done: false } as Milestone] }
              : g,
          ),
        }))
        const updated = get().goals.find((g) => g.id === goalId)
        if (updated) cloudWriteGoal(updated)
      },

      toggleMilestone: (goalId, milestoneId) => {
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === goalId
              ? {
                  ...g,
                  milestones: g.milestones.map((m) => (m.id === milestoneId ? { ...m, done: !m.done } : m)),
                }
              : g,
          ),
        }))
        const updated = get().goals.find((g) => g.id === goalId)
        if (updated) cloudWriteGoal(updated)
      },

      addCheckIn: (mood, energy, note) => {
        get().touchActivity()
        const entry: CheckIn = {
          id: makeId(),
          date: new Date().toISOString(),
          mood,
          energy,
          note: note.trim(),
        }
        set((s) => ({ checkIns: [entry, ...s.checkIns] }))
        cloudWriteCheckIn(entry)
      },

      resetAll: () => set(initialState),

      initCloud: () => {
        startCloud(
          {
            onStatus: (cloudStatus) => set({ cloudStatus }),
            onUser: (cloudUser) => set({ cloudUser }),
            onProfile: (data) => {
              if (!data) return
              set((s) => ({
                userName: data.userName ?? s.userName,
                streak: data.streak ?? s.streak,
                lastActiveDate: data.lastActiveDate !== undefined ? data.lastActiveDate : s.lastActiveDate,
              }))
            },
            onMemories: (items) => {
              if (items.length > 0) set({ memories: byCreatedAtDesc(items) })
            },
            onGoals: (items) => {
              if (items.length > 0) set({ goals: byCreatedAtDesc(items) })
            },
            onCheckIns: (items) => {
              if (items.length > 0) set({ checkIns: [...items].sort((a, b) => b.date.localeCompare(a.date)) })
            },
            onMessages: (items) => {
              if (items.length > 0) set({ messages: [...items].sort((a, b) => a.createdAt.localeCompare(b.createdAt)) })
            },
          },
          () => get(),
        )
      },

      signInWithGoogle: () => cloudSignInWithGoogle(),
      signOutCloud: () => cloudSignOutCloud(),
    }),
    {
      name: 'my-assistant-store',
      version: 1,
      partialize: (state) => {
        const { cloudStatus: _cloudStatus, cloudUser: _cloudUser, ...rest } = state
        return rest
      },
    },
  ),
)
