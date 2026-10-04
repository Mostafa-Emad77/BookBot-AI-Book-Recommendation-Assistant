import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface ChatHeaderProps {
  error: string | null
  onReset: () => void
}

export function ChatHeader({ error, onReset }: ChatHeaderProps) {
  if (!error) return null

  return (
    <div className="bg-red-50 border-b border-red-200 p-3 text-red-700 text-sm flex justify-between items-center">
      <div>
        <span className="font-medium">Error:</span> {error}
      </div>
      <Button variant="ghost" size="sm" onClick={onReset} className="text-red-700">
        <RefreshCw className="h-4 w-4 mr-1" /> Retry
      </Button>
    </div>
  )
}
