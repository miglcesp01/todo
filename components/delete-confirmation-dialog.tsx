"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { X } from "lucide-react"
import type { Task } from "./todo-app"

interface DeleteConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  taskId: string | null
  tasks: Task[]
}

export default function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  taskId,
  tasks,
}: DeleteConfirmationDialogProps) {
  // Find the task to be deleted
  const taskToDelete = tasks.find((task) => task.id === taskId)

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md mx-auto w-[95%] p-6 dark:bg-zinc-900 dark:border-zinc-700 text-left">
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle className="flex justify-between items-center dark:text-zinc-50 text-left">
            <span>Confirm Deletion</span>
            <AlertDialogCancel className="p-1 h-8 w-8 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 border-0">
              <X className="h-4 w-4 text-zinc-500" />
            </AlertDialogCancel>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-700 dark:text-zinc-300 mt-2 text-left">
            {taskToDelete ? (
              <>
                Are you sure you want to delete the task: <span className="font-medium text-zinc-900 dark:text-zinc-100">&quot;{taskToDelete.text}&quot;</span>?
              </>
            ) : (
              "Are you sure you want to delete this task? This action cannot be undone."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 text-left">
          <AlertDialogCancel className="mt-2 sm:mt-0 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 dark:border-zinc-700 w-full sm:w-auto text-center">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 transition-colors w-full sm:w-auto text-center"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}