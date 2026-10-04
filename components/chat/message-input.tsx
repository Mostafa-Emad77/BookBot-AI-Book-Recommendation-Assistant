import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { FormEvent } from "react"

interface MessageInputProps {
  input: string
  setInput: (value: string) => void
  onSubmit: (e: FormEvent) => void
  disabled: boolean
}

export function MessageInput({ input, setInput, onSubmit, disabled }: MessageInputProps) {
  return (
    <div className="p-4 border-t border-gray-100">
      <form onSubmit={onSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a book recommendation..."
          className="flex-1 px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
          disabled={disabled}
        />
        <Button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 h-auto disabled:opacity-50"
          disabled={disabled}
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  )
}
