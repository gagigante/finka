import Link from "next/link";
import { PlusCircle, UserCircle, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";

import { useTaskTable } from "./use-task-table";

import { statuses } from "@/constants/statuses";
import { priorities } from "@/constants/priorities";

const ASSIGNEES = [
  {
    label: "Gabriel Gigante",
    value: "id-1",
  },
  {
    label: "Edson Santos",
    value: "id-2",
  }
]

const CUSTOMERS = [
  {
    label: "Gabriel Gigante",
    value: "id-1",
  }
]

const LABELS = [
  {
    label: "Etiqueta 01",
    value: "id-1",
  }
]

export function TaskTableToolbar() {
  const { table } = useTaskTable()

  return (
    <div className="flex justify-between items-center">
      <div className="space-x-2">
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
      </div>

      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
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
          className="ml-auto hidden h-8 lg:flex"
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
          className="ml-auto hidden h-8 lg:flex"
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
