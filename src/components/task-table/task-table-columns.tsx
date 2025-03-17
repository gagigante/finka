import { type ColumnDef } from "@tanstack/react-table";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DataTableRowActions } from "../data-table/data-table-row-actions";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

import { Task } from "@/schemas/task-schema";

import { formatDate } from "@/utils/formatters";

import { priorities } from "@/constants/priorities";
import { statuses } from "@/constants/statuses";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "assign",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Responsável" />
    ),
    cell: ({ getValue }) => {
      const assign = getValue<Task["assign"]>()

      return (
        <div className="flex justify-start px-2">
          {!!assign ? (
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="h-6 w-6">
                  {assign.avatar && <AvatarImage src={assign.avatar} alt={assign.name} />}
                  <AvatarFallback>{assign.name[0]}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                {assign.name}
              </TooltipContent>
            </Tooltip>
          ) : (
            <span className="font-medium">
              N/A
            </span>
          )}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const assign = row.getValue(id) as Task["assign"]
      return value.includes(assign?.id)
    },
  },
  { 
    accessorKey: "labels",
    filterFn: (row, id, value) => {
      const labels = row.getValue(id) as Task["labels"]
      return value.includes(labels)
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Título" />,
    cell: ({ row }) => {
      const labels = row.getValue("labels") as Task["labels"]

      return (
        <div className="flex flex-col space-y-2 max-w-[420px]">
          <span className=" truncate font-medium">
            {row.getValue("title")}
          </span>

          {labels?.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {labels.map(label => (
                <Badge key={label.id} variant="outline">{label.name}</Badge>
              ))}
            </div>
          )}
        </div>
      )
    },    
    enableSorting: false,
  },
  {
    accessorKey: "customer",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cliente" />,
    cell: ({ row }) => (
      <span className="truncate font-medium">
        {(row.getValue("customer") as Task['customer'])?.name ?? 'N/A'}
      </span>
    ),    
  },
  {
    accessorKey: "priority",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Prioridade" />,
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue("priority")
      )

      if (!priority) {
        return null
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center data-[state=open]:bg-muted">
              <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{priority.label}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            {priorities.map(priority => (
              <DropdownMenuItem key={priority.value}>
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data de abertura" />
    ),
    cell: ({ row }) => (
      <span className="truncate font-medium">
        {formatDate(new Date(row.getValue("created_at")))}
      </span>
    )
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      )

      if (!status) {
        return null
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center data-[state=open]:bg-muted">
              <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{status.label}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            {statuses.map(status => (
              <DropdownMenuItem key={status.value}>
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
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];