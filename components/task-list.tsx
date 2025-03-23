import TaskItem from "@/components/task-item"
import type { Task } from "@/components/todo-app"

interface TaskListProps {
  tasks: Task[]
  onDelete: (id: string) => void
  onToggleComplete: (id: string) => void
  onStartEdit: (id: string) => void
  onSaveEdit: (id: string, newText: string) => void
}

export default function TaskList({ tasks, onDelete, onToggleComplete, onStartEdit, onSaveEdit }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No tasks found. Add a task to get started!</p>
      </div>
    )
  }

  return (
    <ul className="space-y-2" role="list" aria-label="Task list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
          onStartEdit={onStartEdit}
          onSaveEdit={onSaveEdit}
        />
      ))}
    </ul>
  )
}

