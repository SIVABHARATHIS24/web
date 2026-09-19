import type { CheckIn, ChatMessage, Goal, Memory } from '../../types'

export interface CloudUser {
  uid: string
  isAnonymous: boolean
  displayName: string | null
  email: string | null
}

export type CloudStatus = 'unconfigured' | 'connecting' | 'local' | 'synced'

export interface CloudProfile {
  userName?: string
  streak?: number
  lastActiveDate?: string | null
}

export interface CloudCallbacks {
  onStatus: (status: CloudStatus) => void
  onUser: (user: CloudUser | null) => void
  onProfile: (data: CloudProfile | null) => void
  onMemories: (items: Memory[]) => void
  onGoals: (items: Goal[]) => void
  onCheckIns: (items: CheckIn[]) => void
  onMessages: (items: ChatMessage[]) => void
}
