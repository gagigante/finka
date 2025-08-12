"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { useRemoveTask } from "@/hooks/mutations/tasks"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import { type Id } from "../../../convex/_generated/dataModel"
import { type Task } from "@/hooks/queries/tasks"

interface DeleteTaskDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteTaskDialog({
  task,
  open,
  onOpenChange
}: DeleteTaskDialogProps) {
  const { removeTaskMutation } = useRemoveTask()
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async () => {
    if (!task) return

    try {
      setIsDeleting(true)
      await removeTaskMutation({ _id: task._id as Id<"tasks"> })
      toast.success("Tarefa excluída com sucesso")
      onOpenChange(false)
    } catch {
      toast.error("Erro ao excluir tarefa. Tente novamente.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!isDeleting) {
      onOpenChange(open)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={!isDeleting}>
        <DialogHeader>
          <DialogTitle>Excluir tarefa</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir a tarefa "{task?.title}"? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            size="sm"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Excluir
          </Button>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}