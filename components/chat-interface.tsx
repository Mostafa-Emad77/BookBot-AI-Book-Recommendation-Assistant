"use client"

import { useEffect } from "react"
import { useChatState } from "@/hooks/use-chat-state"
import { questions } from "@/lib/constants"
import { ChatHeader } from "./chat/chat-header"
import { MessageList } from "./chat/message-list"
import { MessageInput } from "./chat/message-input"
import { Sparkles, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ChatInterface() {
  const {
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
    handleReset,
    generateChatResponse
  } = useChatState()

  // Initial greeting
  useEffect(() => {
    let mounted = true
    const initialMessage = async () => {
      if (currentStep !== 'INITIAL') return

      setIsLoading(true)
      try {
        const response = await generateChatResponse([{ role: "user", content: "Start the BookBot introduction" }])
        if (mounted) {
            setMessages([{ role: "assistant", content: response }])
            setCurrentStep('ASKING_QUESTIONS')
        }
      } catch (error) {
        if (mounted) {
            setMessages([
              {
                role: "assistant",
                content: "Hi! I'm BookBot, your AI book companion. I'll help you discover books tailored to your preferences. Let me ask you a few questions to understand your taste better.",
              },
            ])
            setCurrentStep('ASKING_QUESTIONS')
        }
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    initialMessage()

    return () => { mounted = false }
  }, [currentStep, generateChatResponse, setMessages, setCurrentStep, setIsLoading])

  // Ask questions
  useEffect(() => {
    if (currentStep === 'ASKING_QUESTIONS' && !isLoading) {
      if (questionIndex < questions.length) {
          const currentQuestion = questions[questionIndex]

          // Only add the question if it's not already the last message
          const lastMessage = messages[messages.length - 1]
          if (!lastMessage || lastMessage.content !== currentQuestion.question) {
               addMessage({
                  role: "assistant",
                  content: currentQuestion.question,
                  isQuestion: true,
                  options: currentQuestion.options,
                })
          }
      } else if (questionIndex >= questions.length) {
          setCurrentStep('GENERATING_RECOMMENDATIONS')
      }
    }
  }, [currentStep, isLoading, questionIndex, messages, addMessage])

  // Generate recommendations
  useEffect(() => {
    let mounted = true
    const generateRecommendations = async () => {
      if (currentStep === 'GENERATING_RECOMMENDATIONS') {
        setIsLoading(true)
        try {
          const promptMessages = [
            {
              role: "user",
              content: `Based on these preferences:
              Question 1: ${userPreferences.question1}
              Question 2: ${userPreferences.question2}
              Question 3: ${userPreferences.question3}
              Question 4: ${userPreferences.question4}
              
              Please provide 3-5 book recommendations with title, author, and a one-sentence summary for each.`,
            },
          ]

          const response = await generateChatResponse(promptMessages)
          if (mounted) {
              addMessage({ role: "assistant", content: response })
              setCurrentStep('FREE_CHAT')
          }
        } catch (error) {
          if (mounted) {
              addMessage({
                role: "assistant",
                content: "I'm sorry, I couldn't generate recommendations at the moment. Please try again later.",
              })
              setCurrentStep('FREE_CHAT') // Allow user to keep talking even if it failed
          }
        } finally {
          if (mounted) setIsLoading(false)
        }
      }
    }

    generateRecommendations()
    return () => { mounted = false }
  }, [currentStep, userPreferences, generateChatResponse, addMessage, setCurrentStep, setIsLoading])

  const handleOptionSelect = (option: string) => {
    if (currentStep === 'ASKING_QUESTIONS') {
      addMessage({ role: "user", content: option })

      setUserPreferences((prev) => ({
        ...prev,
        [`question${questionIndex + 1}`]: option,
      }))

      setQuestionIndex((prev) => prev + 1)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    addMessage({ role: "user", content: userMessage })
    setIsLoading(true)

    try {
      const conversationHistory = messages
        .filter((msg) => !msg.isQuestion)
        .map((msg) => ({ role: msg.role, content: msg.content }))

      const response = await generateChatResponse([...conversationHistory, { role: "user", content: userMessage }])

      addMessage({ role: "assistant", content: response })
    } catch (error) {
      addMessage({
        role: "assistant",
        content: "I'm sorry, I couldn't process your request. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col overflow-hidden rounded-xl bg-white shadow-lg">
        <ChatHeader error={error} onReset={handleReset} />
        <MessageList
            messages={messages}
            isLoading={isLoading}
            onOptionSelect={handleOptionSelect}
        />
        <MessageInput
            input={input}
            setInput={setInput}
            onSubmit={handleSendMessage}
            disabled={currentStep !== 'FREE_CHAT' || isLoading}
        />
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500 flex items-center">
          <Sparkles className="h-4 w-4 mr-1 text-purple-600" />
          <span>BookBot - AI Book Recommendation Companion</span>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="text-gray-600 border-gray-200 hover:bg-gray-100 rounded-full text-xs px-3"
          >
            <RefreshCw className="h-3 w-3 mr-1" /> Start Over
          </Button>
        </div>
      </div>
    </div>
  )
}
