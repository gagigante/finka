import Link from "next/link";
import { PlusCircle, UserCircle } from "lucide-react";

import { Button } from "./ui/button";
import { DataTableFacetedFilter } from "./data-table/data-table-faceted-filter";

export function TableToolbar() {
  return (
    <div className="flex justify-between items-center">
      <div>
      <DataTableFacetedFilter
          column={table.getColumn("status")}
          title="Responsáveis"
          options={[]}
        />
      </div>

      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
          asChild
        >
          <Link href="create-task">
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
      </div>

    </div>
  )
}
