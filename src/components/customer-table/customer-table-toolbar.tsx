"use client"

import Link from "next/link"
import { Table } from "@tanstack/react-table"
import { ArrowLeft } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CreateCustomerDialog } from "../create-customer-dialog"

import { type Customer } from "@/hooks/queries/customers"

interface CustomerTableToolbarProps {
  table?: Table<Customer>
}

export function CustomerTableToolbar({ table }: CustomerTableToolbarProps) {
  if (!table) return null;

  const filterValue = table.getColumn("name")?.getFilterValue() as string ?? ""

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>

        <Input
          placeholder="Filtrar clientes por nome..."
          value={filterValue}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {filterValue && (
          <Button size="sm" variant="outline" onClick={() => table.getColumn("name")?.setFilterValue("")}>
            Limpar filtro
          </Button>
        )}
      </div>

      <CreateCustomerDialog />
    </div>
  )
}