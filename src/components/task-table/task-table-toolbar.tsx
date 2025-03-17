"use client"

import Link from "next/link";
import { PlusCircle, UserCircle, Tag, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";

import { useTaskTable } from "./use-task-table";

import { statuses } from "@/constants/statuses";
import { priorities } from "@/constants/priorities";

const ASSIGNEES = [
  {
    label: "Gabriel Gigante",
    value: "1",
  },
  {
    label: "Edson Santos",
    value: "2",
  }
]

const CUSTOMERS = [
  {
    label: "Gabriel Gigante",
    value: "1",
  },
  {
    label: "Edson Santos",
    value: "2",
  }
]

const LABELS = [
  {
    label: "Documentation",
    value: "1",
  },
  {
    label: "Feature",
    value: "2",
  }
]

export function TaskTableToolbar() {
  const { table } = useTaskTable()

  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex justify-between items-start">
      <div className="flex flex-wrap gap-2">
        <DataTableFacetedFilter
          column={table.getColumn("assign")}
          title="Responsáveis"
          options={ASSIGNEES} // TODO: fetch assignees
        />

        <DataTableFacetedFilter
          column={table.getColumn("labels")}
          title="Etiquetas"
          options={LABELS} // TODO: fetch labels
        />

        <DataTableFacetedFilter
          column={table.getColumn("customer")}
          title="Clientes"
          options={CUSTOMERS} // TODO: fetch customers
        />

        <DataTableFacetedFilter
          column={table.getColumn("priority")}
          title="Prioridades"
          options={priorities}
        />

        <DataTableFacetedFilter
          column={table.getColumn("status")}
          title="Status"
          options={statuses}
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
          asChild
        >
          <Link href="new">
            <PlusCircle />
            Adicionar tarefa
          </Link>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-8"
          asChild
        >
          <Link href="customers">
            <UserCircle />
            Clientes
          </Link>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-8"
          asChild
        >
          <Link href="labels">
            <Tag />
            Etiquetas
          </Link>
        </Button>
      </div>
    </div>
  )
}
