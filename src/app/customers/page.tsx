"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCustomers } from "@/hooks/queries/customers"

export default function Page() {
  const { data: customers } = useCustomers()

  return (
    <div className="flex flex-col gap-4 p-6 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Clientes</h1>
        <Button asChild>
          <Link href="/customers/create">Cadastrar cliente</Link>
        </Button>
      </div>

      <div className="rounded border divide-y">
        {(customers ?? []).map((c) => (
          <div key={(c as any)._id ?? c.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{c.name}</p>
              {c.email && <p className="text-sm text-muted-foreground">{c.email}</p>}
            </div>
          </div>
        ))}
        {(customers ?? []).length === 0 && (
          <div className="p-8 text-center text-muted-foreground">Nenhum cliente cadastrado.</div>
        )}
      </div>
    </div>
  )
}