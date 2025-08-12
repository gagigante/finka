"use client"

import * as React from "react"
import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { DeleteTaskDialog } from "@/components/task-table/delete-task-dialog"
import { TaskDetailsDialog } from "@/components/task-table/task-details-dialog"
import { Task } from "@/schemas/task-schema"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({ 
  row 
}: DataTableRowActionsProps<TData>) {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false)
  const task = row.original as unknown as Task

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          {/* <DropdownMenuItem>
            <UserPlus className="mr-2 h-4 w-4" /> Atribuir responsável
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Paperclip className="mr-2 h-4 w-4" /> Adicionar anexo
          </DropdownMenuItem> 
          <DropdownMenuSeparator />*/}
          <DropdownMenuItem onClick={() => setDetailsDialogOpen(true)}>Ver detalhes</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-red-500 hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Excluir tarefa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteTaskDialog
        task={task}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />

      <TaskDetailsDialog
        task={task}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />
    </>
  )
}
