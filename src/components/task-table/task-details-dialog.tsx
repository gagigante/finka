"use client"

import { useState, useEffect } from "react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { useUsers } from "@/hooks/queries/users"
import { useCustomers } from "@/hooks/queries/customers"
import { useUpdateTask } from "@/hooks/mutations/tasks"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TaskDescriptionRichText } from "../create-task-dialog/task-description-rich-text"
import { TaskAttributes } from "../create-task-dialog/task-attributes"

import { type Id } from "../../../convex/_generated/dataModel"
import { Task } from "@/schemas/task-schema"
import { type Status } from "@/constants/statuses"

interface TaskDetailsDialogProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskDetailsDialog({ task, open, onOpenChange }: TaskDetailsDialogProps) {
  const { updateTaskMutation } = useUpdateTask()
  const { data: users } = useUsers()
  const { data: customers } = useCustomers()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || "")
  const [selectedAssignmentsIds, setSelectedAssignmentsIds] = useState<string[]>(
    task.users?.map(user => user.id) || []
  )
  const [selectedCustomersIds, setSelectedCustomersIds] = useState<string[]>(
    task.customers?.map(customer => customer.id) || []
  )
  const [selectedStatus, setSelectedStatus] = useState<Status | undefined>(
    task.status as Status
  )
  const [selectedPriority, setSelectedPriority] = useState<string | null>(
    task.priority || null
  )

  // Update state when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || "")
      setSelectedAssignmentsIds(task.users?.map(user => user.id) || [])
      setSelectedCustomersIds(task.customers?.map(customer => customer.id) || [])
      setSelectedStatus(task.status as Status)
      setSelectedPriority(task.priority || null)
    }
  }, [task])

  async function handleSubmit() {
    setIsSubmitting(true)

    try {
      await updateTaskMutation({
        _id: task._id as Id<"tasks">,
        title,
        description,
        customersIds: selectedCustomersIds as Id<"customers">[],
        usersIds: selectedAssignmentsIds as Id<"users">[],
        priority: selectedPriority,
        status: selectedStatus,
        updated_at: new Date().toISOString(),
        finished_at: selectedStatus === "done" ? new Date().toISOString() : undefined,
      })

      onOpenChange(false)
      toast.success("Tarefa atualizada com sucesso!")
    } catch (error) {
      toast.error("Houve um erro ao atualizar a tarefa. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-0 !max-w-[900px] !w-[95vw] sm:!max-w-[900px] !top-[12vh] !translate-y-0 !max-h-[80vh] !p-0">
        <DialogHeader className="flex items-center justify-between flex-row p-6 border-b">
          <DialogTitle>Detalhes da tarefa</DialogTitle>
          <VisuallyHidden>
            <DialogDescription>
              Visualize e edite os detalhes da tarefa.
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 py-4 px-4 space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Descrição <span className="text-muted-foreground font-normal text-xs">(opcional)</span>
            </Label>
            <div className="mt-2 border rounded-md py-1">
              <TaskDescriptionRichText
                value={description}
                onChange={setDescription}
              />
            </div>
          </div>
        </div>

        <div className="px-4 pt-4 border-t">
          <TaskAttributes
            users={users || []}
            customers={customers || []}
            selectedAssignmentsIds={selectedAssignmentsIds}
            selectedCustomersIds={selectedCustomersIds}
            selectedPriority={selectedPriority}
            selectedStatus={selectedStatus}
            onChangeAssignments={setSelectedAssignmentsIds}
            onChangeCustomers={setSelectedCustomersIds}
            onChangePriority={setSelectedPriority}
            onChangeStatus={setSelectedStatus}
          />
        </div>

        <div className="flex justify-end gap-2 p-4">
          <Button size="sm" disabled={isSubmitting || title === ""} onClick={handleSubmit}>
            {isSubmitting && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
            Salvar alterações
          </Button>

          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancelar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}