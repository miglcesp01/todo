import type { Metadata } from "next"
import TodoApp from "@/components/todo-app"

export const metadata: Metadata = {
  title: "Todo List Manager",
  description: "Manage your tasks with categories and dark mode support",
}

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12">
      <TodoApp />
    </main>
  )
}

