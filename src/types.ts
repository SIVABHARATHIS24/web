export type MemoryKind = 'fact' | 'preference' | 'goal-related' | 'reflection' | 'win'

export interface Memory {
  id: string
  text: string
  kind: MemoryKind
  tags: string[]
  createdAt: string
  pinned: boolean
  source: 'chat' | 'manual'
}

export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: ChatRole
  text: string
  createdAt: string
  memoryIds?: string[]
}

export type GoalStatus = 'active' | 'done' | 'paused'

export interface Milestone {
  id: string
  text: string
  done: boolean
}

export interface Goal {
  id: string
  title: string
  why: string
  status: GoalStatus
  createdAt: string
  targetDate?: string
  milestones: Milestone[]
}

export interface CheckIn {
  id: string
  date: string
  mood: number
  energy: number
  note: string
}

export interface AppState {
  userName: string
  memories: Memory[]
  messages: ChatMessage[]
  goals: Goal[]
  checkIns: CheckIn[]
  lastActiveDate: string | null
  streak: number
}
