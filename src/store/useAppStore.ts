import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { makeId } from '../lib/id'
import { detectMemory, generateReply } from '../lib/localAssistant'
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

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUserName: (name) => set({ userName: name.trim() }),

      touchActivity: () =>
        set((s) => ({
          streak: computeStreak(s.lastActiveDate, s.streak),
          lastActiveDate: isoToday(),
        })),

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
          set({ userName: trimmed.replace(/^(i'?m|call me|my name is)\s+/i, '').trim() })
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
      },

      addMemory: (text, kind, tags = []) =>
        set((s) => ({
          memories: [
            {
              id: makeId(),
              text: text.trim(),
              kind,
              tags,
              createdAt: new Date().toISOString(),
              pinned: false,
              source: 'manual',
            },
            ...s.memories,
          ],
        })),

      removeMemory: (id) => set((s) => ({ memories: s.memories.filter((m) => m.id !== id) })),

      togglePinMemory: (id) =>
        set((s) => ({
          memories: s.memories.map((m) => (m.id === id ? { ...m, pinned: !m.pinned } : m)),
        })),

      addGoal: (title, why, targetDate) =>
        set((s) => ({
          goals: [
            {
              id: makeId(),
              title: title.trim(),
              why: why.trim(),
              status: 'active',
              createdAt: new Date().toISOString(),
              targetDate,
              milestones: [],
            },
            ...s.goals,
          ],
        })),

      removeGoal: (id) => set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

      setGoalStatus: (id, status) =>
        set((s) => ({ goals: s.goals.map((g) => (g.id === id ? { ...g, status } : g)) })),

      addMilestone: (goalId, text) =>
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === goalId
              ? { ...g, milestones: [...g.milestones, { id: makeId(), text: text.trim(), done: false } as Milestone] }
              : g,
          ),
        })),

      toggleMilestone: (goalId, milestoneId) =>
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === goalId
              ? {
                  ...g,
                  milestones: g.milestones.map((m) => (m.id === milestoneId ? { ...m, done: !m.done } : m)),
                }
              : g,
          ),
        })),

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
      },

      resetAll: () => set(initialState),
    }),
    {
      name: 'my-assistant-store',
      version: 1,
    },
  ),
)
