import type { Memory, MemoryKind, Goal, CheckIn } from '../types'

interface DetectedMemory {
  text: string
  kind: MemoryKind
  tags: string[]
}

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'to', 'of', 'in', 'on', 'for', 'is',
  'it', 'i', 'my', 'me', 'im', "i'm", 'that', 'this', 'was', 'with', 'be',
  'am', 'are', 'at', 'as', 'so', 'about', 'just', 'really', 'very', 'you',
])

export function keywordsOf(text: string): string[] {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9'\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 3 && !STOPWORDS.has(w)),
    ),
  )
}

const PATTERNS: Array<{ re: RegExp; kind: MemoryKind }> = [
  { re: /^remember(?: that)?\s+(.+)/i, kind: 'fact' },
  { re: /^(?:fyi|note)[:-]?\s+(.+)/i, kind: 'fact' },
  { re: /^i(?:'m| am) (?:really |so )?(?:proud|happy|excited) (?:that |about |because )?(.+)/i, kind: 'win' },
  { re: /^i (?:love|enjoy|like) (.+)/i, kind: 'preference' },
  { re: /^i (?:hate|dislike|can't stand) (.+)/i, kind: 'preference' },
  { re: /^i (?:want|hope|plan|would like) to (.+)/i, kind: 'goal-related' },
  { re: /^i (?:feel|felt|realized|noticed|learned) (.+)/i, kind: 'reflection' },
  { re: /^my (goal|dream|focus) is (.+)/i, kind: 'goal-related' },
]

export function detectMemory(rawText: string): DetectedMemory | null {
  const text = rawText.trim()
  if (text.length < 6) return null

  for (const { re, kind } of PATTERNS) {
    const match = text.match(re)
    if (match) {
      return {
        text: capitalize(text.replace(/^remember(?: that)?\s+/i, '').trim()),
        kind,
        tags: keywordsOf(text).slice(0, 4),
      }
    }
  }
  return null
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const OPENERS = [
  "Got it — I'll hold onto that.",
  "Thanks for sharing that with me.",
  "Noted, and tucked away in your memory bank.",
  "I hear you.",
]

const GROWTH_QUESTIONS = [
  'What would make today feel like a win?',
  "What's one small step you could take on this in the next 24 hours?",
  'On a scale of 1-10, how aligned does this feel with what you actually want?',
  "What's getting in the way right now?",
  'Who or what could support you with this?',
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export interface AssistantContext {
  memories: Memory[]
  goals: Goal[]
  checkIns: CheckIn[]
  streak: number
  userName: string
}

export function relatedMemories(text: string, memories: Memory[], limit = 2): Memory[] {
  const kws = new Set(keywordsOf(text))
  if (kws.size === 0) return []
  const scored = memories
    .map((m) => {
      const overlap = m.tags.filter((t) => kws.has(t)).length
      return { m, overlap }
    })
    .filter((s) => s.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
  return scored.slice(0, limit).map((s) => s.m)
}

export function generateReply(userText: string, ctx: AssistantContext, savedMemory: DetectedMemory | null): string {
  const parts: string[] = []
  const trimmed = userText.trim().toLowerCase()

  if (/^(hi|hey|hello|yo)\b/.test(trimmed)) {
    const streakLine = ctx.streak > 1 ? ` That's a ${ctx.streak}-day streak of checking in — nice consistency.` : ''
    parts.push(`Hey${ctx.userName ? ' ' + ctx.userName : ''}! Good to see you.${streakLine} What's on your mind?`)
    return parts.join(' ')
  }

  if (/how am i doing|progress|check.?in/.test(trimmed)) {
    const activeGoals = ctx.goals.filter((g) => g.status === 'active')
    if (activeGoals.length === 0) {
      parts.push("You don't have any active goals tracked yet — want to set one? I'll help you break it into steps.")
    } else {
      const summaries = activeGoals
        .slice(0, 3)
        .map((g) => {
          const done = g.milestones.filter((m) => m.done).length
          const total = g.milestones.length
          return total > 0 ? `"${g.title}" (${done}/${total} milestones)` : `"${g.title}"`
        })
        .join(', ')
      parts.push(`You're actively working on: ${summaries}. ${pick(GROWTH_QUESTIONS)}`)
    }
    return parts.join(' ')
  }

  if (saved(savedMemory)) {
    parts.push(pick(OPENERS))
    if (savedMemory!.kind === 'win') {
      parts.push("Celebrate that — it counts. What made it possible?")
    } else if (savedMemory!.kind === 'goal-related') {
      parts.push('Want me to turn that into a tracked goal with milestones?')
    } else if (savedMemory!.kind === 'reflection') {
      parts.push(pick(GROWTH_QUESTIONS))
    }
  }

  const related = relatedMemories(userText, ctx.memories, 1)
  if (related.length > 0 && !saved(savedMemory)) {
    parts.push(`This connects to something you told me before: "${related[0].text}" — still true?`)
  }

  if (parts.length === 0) {
    if (/\?$/.test(userText.trim())) {
      parts.push("That's a good question to sit with. What's your gut telling you?")
    } else {
      parts.push(pick([
        "Tell me more — I'm listening.",
        'I appreciate you sharing that. Want to unpack it a bit more?',
        "That's worth remembering. Want me to save it, or just talk it through?",
      ]))
    }
  }

  return parts.join(' ')
}

function saved(d: DetectedMemory | null): d is DetectedMemory {
  return d !== null
}
