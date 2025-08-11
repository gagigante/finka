"use client"

import { useCustomers } from "@/hooks/queries/customers"

import { AppHeader } from "@/components/app-header"
import { CustomerTable } from "@/components/customer-table"

export default function Page() {
  const { data: customers } = useCustomers()

  return (
    <div className="flex w-full max-w-[1366px] h-full mx-auto">
      <div className="flex flex-1 flex-col space-y-8 p-8">
        <AppHeader title="Clientes" description="Gerencie os clientes do sistema" />

        <CustomerTable.Root data={customers}>
          <CustomerTable.Toolbar />
          <CustomerTable.DataTable />
        </CustomerTable.Root>
      </div>
    </div>
  )
}