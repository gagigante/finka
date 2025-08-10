"use client"

import { useState } from "react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { useUsers } from "@/hooks/queries/users"
import { useCustomers } from "@/hooks/queries/customers"
import { useCreateTask } from "@/hooks/mutations/tasks"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
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
import { TaskDescriptionRichText } from "./task-description-rich-text"
import { TaskAttributes } from "./task-attributes"

import { type Id } from "../../../convex/_generated/dataModel"

import { statuses, type Status } from "@/constants/statuses"

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTaskDialog({ open, onOpenChange }: CreateTaskDialogProps) {
  const { createTaskMutation } = useCreateTask()
  const { data: users } = useUsers()
  const { data: customers } = useCustomers()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedAssignmentsIds, setSelectedAssignmentsIds] = useState<string[]>([])
  const [selectedCustomersIds, setSelectedCustomersIds] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<Status>(statuses[0].value)
  const [selectedPriority, setSelectedPriority] = useState<string>()

  function resetFields() {
    setTitle("")
    setDescription("")
    setSelectedCustomersIds([])
    setSelectedStatus(statuses[0].value)
    setSelectedPriority(undefined)
  }

  async function handleSubmit() {
    setIsSubmitting(true)

    try {
      await createTaskMutation({
        title,
        description,
        customersIds: selectedCustomersIds as Id<"customers">[],
        usersIds: selectedAssignmentsIds as Id<"users">[],
        priority: selectedPriority,
        status: selectedStatus,
        created_at: new Date().toISOString(),
        updated_at: undefined,
        finished_at: selectedStatus === "done" ? new Date().toISOString() : undefined,
      })

      resetFields()
      onOpenChange(false)
      toast.success("Tarefa criada com sucesso!")
    } catch (error) {
      toast.error("Houve um erro ao criar a tarefa. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleClose() {
    resetFields()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex flex-col gap-0 !max-w-[900px] !w-[95vw] sm:!max-w-[900px] !top-[12vh] !translate-y-0 !max-h-[80vh] !p-0">
        <DialogHeader className="flex items-center justify-between flex-row p-6 border-b">
          <DialogTitle>Criar nova tarefa</DialogTitle>
          <VisuallyHidden>
            <DialogDescription>
              Preencha os dados do cliente para cadastrá-lo no sistema.
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
            users={users}
            customers={customers}
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
            Criar tarefa
          </Button>

          <Button type="button" variant="outline" size="sm" onClick={handleClose}>Cancelar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}