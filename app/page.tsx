import { redirect } from "next/navigation"

export default function Home() {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    redirect("/api-key-error")
  }

  redirect("/chat")
}
