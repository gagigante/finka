import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { useUpdateTask } from "@/hooks/mutations/tasks";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DataTableRowActions } from "../data-table/data-table-row-actions";
import { AvatarGroup } from "./avatar-group";

import { Task } from "@/schemas/task-schema";

import { formatDate } from "@/utils/formatters";

import { emptyPriority, priorities } from "@/constants/priorities";
import { emptyStatus, statuses } from "@/constants/statuses";

import { type Id } from "../../../convex/_generated/dataModel";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Título
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "users",
    header: "Responsáveis",
    cell: ({ row }) => {
      const users = row.original.users || []
      
      return (
        <div className="flex items-center px-2">
          <AvatarGroup 
            items={users} 
            max={3} 
            emptyText="N/A" 
            tooltipTitle="Outros responsáveis" 
          />
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const users = row.getValue(id) as Task["users"]
      if (!users) return false
      return users.some(user => value.includes(user.id))
    },
    enableSorting: false,
  },
  {
    accessorKey: "customers",
    header: "Clientes",
    cell: ({ row }) => {
      const customers = row.original.customers || []
      
      return (
        <div className="flex items-center px-2">
          <AvatarGroup 
            items={customers} 
            max={3} 
            emptyText="N/A" 
            tooltipTitle="Outros clientes" 
          />
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const customers = row.getValue(id) as Task["customers"]
      if (!customers) return false
      return customers.some(customer => value.includes(customer.id))
    },
    enableSorting: false,
  },
  {
    accessorKey: "priority",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Prioridade
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const { updateTaskMutation } = useUpdateTask()

      async function handlePriorityChange(priority: string | null) {
        await updateTaskMutation({
          _id: row.original._id as Id<"tasks">,
          priority,
        })
      }

      const priority = priorities.find(
        (priority) => priority.value === row.getValue("priority")
      )

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center data-[state=open]:bg-muted">
              {priority ? (
                <>
                  <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{priority.label}</span>
                </>
              ): (
                <>
                  <emptyPriority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{emptyPriority.label}</span>
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem key={emptyPriority.value} onClick={() => handlePriorityChange(emptyPriority.value)}>
              <emptyPriority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              {emptyPriority.label}
            </DropdownMenuItem>
            
            {priorities.map(priority => (
              <DropdownMenuItem key={priority.value} onClick={() => handlePriorityChange(priority.value)}>
                <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                {priority.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Data de abertura
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <span className="truncate font-medium">
        {formatDate(new Date(row.getValue("created_at")))}
      </span>
    )
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const { updateTaskMutation } = useUpdateTask()

      async function handleStatusChange(status: string | null) {
        await updateTaskMutation({
          _id: row.original._id as Id<"tasks">,
          status,
        })
      }

      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      )

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center data-[state=open]:bg-muted">
              {status ? (
                <>
                  <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{status.label}</span>
                </>
              ) : (
                <>
                  <emptyStatus.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{emptyStatus.label}</span>
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem key={emptyStatus.value} onClick={() => handleStatusChange(emptyStatus.value)}>
              <emptyStatus.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              {emptyStatus.label}
            </DropdownMenuItem>

            {statuses.map(status => (
              <DropdownMenuItem key={status.value} onClick={() => handleStatusChange(status.value)}>
                <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                {status.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    filterFn: (row, id, value) => {
      const status = row.getValue(id) as Task['status']
      return value.includes(status)
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <DataTableRowActions row={row} />
    },
  },
];