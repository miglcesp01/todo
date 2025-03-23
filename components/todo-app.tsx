"use client"

import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"
import TaskList from "@/components/task-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { toast } from "sonner"
import TaskForm from "./task-form"

export type Task = {
  id: string
  text: string
  completed: boolean
  category: string
  isEditing?: boolean
  dueDate?: Date
}

export type Category = "all" | "work" | "personal" | "shopping"

const categories: Category[] = ["all", "personal", "work", "shopping"]

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeCategory, setActiveCategory] = useState<Category>("all")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  
  // Use a ref for lastDeletedTask to ensure it's always accessible in the toast action
  const lastDeletedTaskRef = useRef<{task: Task, index: number} | null>(null)

  // Load tasks from localStorage on initial render
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem("tasks")
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks))
      }
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error)
      // Fallback to empty array if there's an error
      setTasks([])
    }

    // Check user's preferred color scheme
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks))
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error)
    }
  }, [tasks])

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const addTask = (text: string, dueDate?: Date) => {
    const task: Task = {
      id: Date.now().toString(),
      text,
      completed: false,
      category: activeCategory === "all" ? "personal" : activeCategory, // Default to "personal" if "all" is selected
      dueDate
    }

    setTasks([...tasks, task])
    toast(`"${text}" added to ${task.category}`)
  }

  const confirmDeleteTask = (id: string) => {
    setTaskToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const deleteTask = () => {
    if (taskToDelete) {
      // Find the task we're about to delete
      const taskIndex = tasks.findIndex(task => task.id === taskToDelete)
      
      if (taskIndex !== -1) {
        const taskToRemove = tasks[taskIndex]
        
        // Save the deleted task and its position for potential restoration
        lastDeletedTaskRef.current = {
          task: { ...taskToRemove }, // Create a deep copy to avoid reference issues
          index: taskIndex
        }
        
        // Update tasks list
        setTasks(tasks.filter((task) => task.id !== taskToDelete))
        
        // Show toast with undo button
        toast("Task deleted", {
          duration: 5000, // Give users 5 seconds to undo
          action: {
            label: "Undo",
            onClick: undoDelete,
          },
        })
      }
      
      setTaskToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const undoDelete = () => {
    if (lastDeletedTaskRef.current) {
      const { task, index } = lastDeletedTaskRef.current
      
      // Insert the task back at its original position if possible
      setTasks(prevTasks => {
        const newTasks = [...prevTasks]
        // Make sure index is still valid (might not be if list has shrunk)
        const insertIndex = Math.min(index, newTasks.length)
        newTasks.splice(insertIndex, 0, task)
        return newTasks
      })
      
      toast(`"${task.text}" restored`)
      
      // Clear the saved task
      lastDeletedTaskRef.current = null
    }
  }

  const cancelDelete = () => {
    setTaskToDelete(null)
    setIsDeleteDialogOpen(false)
  }

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const startEditTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, isEditing: true } : { ...task, isEditing: false })))
  }

  const saveEditedTask = (id: string, newText: string, newDueDate?: Date, edited: boolean = true) => {
    if (newText.trim()) {
      setTasks(tasks.map((task) => task.id === id ? { ...task, text: newText.trim(), dueDate: newDueDate, isEditing: false } : task))
      if (edited) toast("Task updated");
    }
  }

  const filteredTasks = tasks.filter((task) => activeCategory === "all" ? true : task.category === activeCategory)

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-bold">Todo List Manager</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </CardHeader>
        <CardContent>
          {/* Categories tabs are moved up for better visibility */}
          <Tabs
            defaultValue="all"
            value={activeCategory}
            onValueChange={(value) => setActiveCategory(value as Category)}
            className="mb-6"
          >
            <TabsList className="grid grid-cols-1 md:grid-cols-4 w-full h-full">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="mx-1 capitalize cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-300 dark:hover:text-zinc-800">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Keep TaskForm with original props structure */}
          <div className="mb-6">
            <TaskForm onAddTask={addTask} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          </div>
          
          {/* Task list display */}
          <TaskList
            tasks={filteredTasks}
            onDelete={confirmDeleteTask}
            onToggleComplete={toggleTaskCompletion}
            onStartEdit={startEditTask}
            onSaveEdit={saveEditedTask}
          />
        </CardContent>
      </Card>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={cancelDelete}
        onConfirm={deleteTask}
        taskId={taskToDelete}
        tasks={tasks}
      />
    </div>
  )
}