"use client"

import type { Task } from "@/components/todo-app"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2 } from "lucide-react"

interface TaskItemProps {
  task: Task
  onDelete: (id: string) => void
  onToggleComplete: (id: string) => void
}

const shakeAnimation = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-8px); }
    75% { transform: translateX(8px); }
  }

  .shake {
    animation: shake 0.3s ease-in-out;
  }

  .border-red-500 {
    border-color: rgb(239 68 68);
  }
`

export default function TaskItem({ task, onDelete, onToggleComplete }: TaskItemProps) {
  const categoryColors = {
    work: "bg-rose-500",
    personal: "bg-emerald-500",
    shopping: "bg-amber-500",
  }

  const categoryColor = categoryColors[task.category as keyof typeof categoryColors] || "bg-slate-500"

  return (
    <>
      <style>{shakeAnimation}</style>
      <li className={`flex items-center justify-between p-3 rounded-md border bg-card ${ task.isEditing ? " max-md:flex-col" : ""}`}>
      <div className="flex items-center gap-3 flex-1">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={() => onToggleComplete(task.id)}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        />
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">

              <label
                htmlFor={`task-${task.id}`}
                className={`flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}
              >
                {task.text}
              </label>
          <div className="flex items-center gap-2">
            <Badge className={`${categoryColor} text-white capitalize text-xs`}>{task.category}</Badge>
          </div>
        </div>
      </div>
        <Button variant="ghost" size="icon" className="mx-2" onClick={() => onDelete(task.id)} aria-label={`Delete task: ${task.text}`}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
    </li>
    </>
  )
}

