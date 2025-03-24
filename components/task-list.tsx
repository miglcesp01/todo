import TaskItem from "@/components/task-item"
import type { Task } from "@/components/todo-app"

interface TaskListProps {
  tasks: Task[]
  onDelete: (id: string) => void
  onToggleComplete: (id: string) => void
  activeCategory: string
}

export default function TaskList({ tasks, onDelete, onToggleComplete, activeCategory }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {activeCategory == "all"
          ? <p>No tasks found. Add a task to get started!</p>
          : <p>No {activeCategory} tasks were found. Add a task to get started!</p>
        }
        
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
        />
      ))}
    </ul>
  )
}

