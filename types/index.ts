export type Message = {
  role: "user" | "assistant"
  content: string
  isQuestion?: boolean
  options?: string[]
}

export type UserPreference = {
  question1?: string
  question2?: string
  question3?: string
  question4?: string
}

export type ChatStep = 'INITIAL' | 'ASKING_QUESTIONS' | 'GENERATING_RECOMMENDATIONS' | 'FREE_CHAT'
