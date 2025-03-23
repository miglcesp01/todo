"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { Category } from "./todo-app"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

// Define form validation schema
const taskFormSchema = z.object({
  taskText: z
    .string()
    .min(1, { message: "Task cannot be empty" })
    .max(100, { message: "Task is too long (max 100 characters)" })
    .trim(),
  category: z
    .string()
    .refine((val) => val !== "all", { message: "Please select a category" }),
  dueDate: z.date().optional()
})

type TaskFormValues = z.infer<typeof taskFormSchema>

interface TaskFormProps {
  onAddTask: (text: string, dueDate?: Date) => void
  activeCategory: Category
  setActiveCategory: (category: Category) => void
}

export default function TaskForm({ onAddTask, activeCategory, setActiveCategory }: TaskFormProps) {
  // Initialize form with react-hook-form
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      taskText: "",
      category: activeCategory,
      dueDate: undefined,
    },
  })

  const categories = ["personal", "work", "shopping", "all"]

  // Update form default values when activeCategory changes
  useEffect(() => {
    form.setValue("category", activeCategory)
  }, [activeCategory, form])

  // Handle form submission
  function onSubmit(data: TaskFormValues) {
    if (activeCategory === "all") {
      form.setError("category", { message: "Please select a category" })
      return
    }
    onAddTask(data.taskText, data.dueDate)
    form.reset({
      taskText: "",
      category: activeCategory,
      dueDate: undefined
    })
  }

  return (
    <Form {...form}>
      <form onClick={() => {
          if (activeCategory === "all") {
            form.setError("category", { message: "Please select a category" })
          }
        }} onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 mb-6 flex-col md:flex-row w-full">
        <div className="flex w-full gap-2 md:flex-row flex-col">
          <FormField
            control={form.control}
            name="taskText"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input disabled={activeCategory === "all"} placeholder="Add a new task..." {...field} aria-label="New task text" className="disabled:bg-muted disabled:cursor-not-allowed" />
                </FormControl>
                <FormMessage className="text-xs mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <Select
                  value={activeCategory}
                  onValueChange={(value) => {
                    setActiveCategory(value as Category);
                    field.onChange(value);
                    if (value !== "all") {
                      form.clearErrors("category");
                    }
                  }}
                >
                  <SelectTrigger className="w-[130px] max-md:w-full capitalize">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                        disabled={category === "all"}
                        hidden={category === "all"}
                        className={category === "all" ? "text-muted-foreground capitalize" : "capitalize"}
                      >
                        {category === "all" ? "Category" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs mt-1" />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={activeCategory === "all"}>
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </form>
    </Form>
  )
}

