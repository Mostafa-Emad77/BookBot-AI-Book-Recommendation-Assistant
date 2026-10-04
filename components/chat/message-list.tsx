import { useRef, useEffect } from "react"
import { Sparkles } from "lucide-react"
import MultipleChoiceQuestion from "@/components/multiple-choice-question"
import { Message } from "@/types"
import { cn } from "@/lib/utils"

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
  onOptionSelect: (option: string) => void
}

export function MessageList({ messages, isLoading, onOptionSelect }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6"
      aria-live="polite"
      aria-atomic="false"
    >
      {messages.map((message, index) => (
        <div
          key={index}
          className={cn(
            "flex items-start",
            message.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          {message.role === "assistant" && (
            <div className="bg-purple-600 text-white rounded-full p-2 mr-2 flex-shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
          )}
          <div
            className={cn(
              "bg-white rounded-xl p-4 shadow-sm max-w-[80%]",
              message.isQuestion && "bg-white"
            )}
          >
            {message.role !== "user" && !message.isQuestion && (
              <div className="text-xs text-gray-500 mb-1">BOOKBOT</div>
            )}
            {message.role === "user" && <div className="text-xs text-gray-500 mb-1">YOU</div>}
            {message.isQuestion ? (
              <MultipleChoiceQuestion
                question={message.content}
                options={message.options || []}
                onSelect={onOptionSelect}
              />
            ) : (
              <div className="whitespace-pre-wrap">{message.content}</div>
            )}
          </div>
          {message.role === "user" && (
            <div className="bg-gray-200 rounded-full p-2 ml-2 flex-shrink-0">
              <div className="h-4 w-4 flex items-center justify-center text-xs font-bold">Y</div>
            </div>
          )}
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start items-start">
          <div className="bg-purple-600 text-white rounded-full p-2 mr-2 flex-shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm max-w-[80%]">
            <div className="text-xs text-gray-500 mb-1">BOOKBOT</div>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 rounded-full bg-purple-600 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-purple-600 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-purple-600 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}
