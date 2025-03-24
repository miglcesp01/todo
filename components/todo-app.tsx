"use client"

import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"
import TaskList from "@/components/task-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { toast } from "sonner"
import TaskForm from "@/components/task-form"

export type Task = {
  id: string
  text: string
  completed: boolean
  category: string
  isEditing?: boolean
}

export type Category = "all" | "work" | "personal" | "shopping"

const categories: Category[] = ["all", "personal", "work", "shopping"]

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeCategory, setActiveCategory] = useState<Category>("all")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  
  const lastDeletedTaskRef = useRef<{task: Task, index: number} | null>(null)

  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem("tasks")
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks))
      }
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error)
      setTasks([])
    }

    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks))
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error)
    }
  }, [tasks])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const addTask = (text: string) => {
    const task: Task = {
      id: Date.now().toString(),
      text,
      completed: false,
      category: activeCategory === "all" ? "personal" : activeCategory,
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
      const taskIndex = tasks.findIndex(task => task.id === taskToDelete)
      
      if (taskIndex !== -1) {
        const taskToRemove = tasks[taskIndex]
        
        lastDeletedTaskRef.current = {
          task: { ...taskToRemove },
          index: taskIndex
        }
        
        setTasks(tasks.filter((task) => task.id !== taskToDelete))
        
        toast("Task deleted", {
          duration: 5000,
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
      
      setTasks(prevTasks => {
        const newTasks = [...prevTasks]
        const insertIndex = Math.min(index, newTasks.length)
        newTasks.splice(insertIndex, 0, task)
        return newTasks
      })
      
      toast(`"${task.text}" restored`)
      
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
          <Tabs
            defaultValue="all"
            value={activeCategory}
            onValueChange={(value) => setActiveCategory(value as Category)}
            className="mb-6"
          >
            <TabsList className="grid grid-cols-1 md:grid-cols-4 w-full h-full gap-1">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="capitalize cursor-pointer hover:bg-[#e5e5e5] dark:hover:bg-[#333333] transition-colors">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="mb-6">
            <TaskForm onAddTask={addTask} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          </div>
          
          <TaskList
            tasks={filteredTasks}
            onDelete={confirmDeleteTask}
            onToggleComplete={toggleTaskCompletion}
            activeCategory={activeCategory}
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