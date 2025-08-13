"use client"

import { useState } from "react";
import Link from "next/link";
import { PlusCircle, UserCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";

import { useUsers } from "@/hooks/queries/users";
import { useCustomers } from "@/hooks/queries/customers";
import { useTaskTable } from "./use-task-table";

import { CreateTaskDialog } from "@/components/create-task-dialog";

import { priorities } from "@/constants/priorities";
import { statuses } from "@/constants/statuses";

export function TaskTableToolbar() {
  const { data: users } = useUsers()
  const { data: customers } = useCustomers()

  const { table } = useTaskTable()
  
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex justify-between items-start">
      <div className="flex flex-wrap gap-2">
        <DataTableFacetedFilter
          column={table.getColumn("users")}
          title="Responsáveis"
          options={users.map(user => ({
            label: user.name,
            value: user._id,
          }))}
        />

        <DataTableFacetedFilter
          column={table.getColumn("customers")}
          title="Clientes"
          options={customers.map(customer => ({
            label: customer.name,
            value: customer._id,
          }))}
        />

        <DataTableFacetedFilter
          column={table.getColumn("priority")}
          title="Prioridades"
          options={priorities}
        />

        <DataTableFacetedFilter
          column={table.getColumn("status")}
          title="Status"
          options={statuses.map(status => ({
            label: status.label,
            value: status.value,
            icon: status.icon
          }))}
        />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2"
          >
            Limpar filtros
            <X />
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => setCreateModalOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar tarefa
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-8"
          asChild
        >
          <Link href="/customers">
            <UserCircle className="mr-2 h-4 w-4" />
            Clientes
          </Link>
        </Button>
      </div>

      <CreateTaskDialog 
        open={createModalOpen} 
        onOpenChange={setCreateModalOpen} 
      />
    </div>
  )
}