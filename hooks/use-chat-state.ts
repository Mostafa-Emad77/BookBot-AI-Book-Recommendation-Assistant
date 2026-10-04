import { useState, useCallback } from "react"
import { Message, UserPreference, ChatStep } from "@/types"
import { questions } from "@/lib/constants"
import { useToast } from "@/hooks/use-toast"

export function useChatState() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<ChatStep>('INITIAL')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [userPreferences, setUserPreferences] = useState<UserPreference>({})
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleReset = useCallback(() => {
    setMessages([])
    setCurrentStep('INITIAL')
    setQuestionIndex(0)
    setUserPreferences({})
    setError(null)
    setIsLoading(false)
  }, [])

  const addMessage = useCallback((message: Message) => {
      setMessages(prev => [...prev, message])
  }, [])

  const generateChatResponse = useCallback(async (msgs: Message[]): Promise<string> => {
    try {
      setError(null)

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: msgs }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate response")
      }

      const data = await response.json()
      return data.text
    } catch (err) {
      console.error("Error generating chat response:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to generate response"

      setError(errorMessage)
      toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
      })
      throw err // re-throw to be handled by the caller if needed
    }
  }, [toast])


  return {
    messages,
    setMessages,
    addMessage,
    input,
    setInput,
    isLoading,
    setIsLoading,
    currentStep,
    setCurrentStep,
    questionIndex,
    setQuestionIndex,
    userPreferences,
    setUserPreferences,
    error,
    setError,
    handleReset,
    generateChatResponse
  }
}
