"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CustomerRowActions } from "./customer-row-actions"
import { EditableCell } from "./editable-cell"
import { EditablePhoneCell } from "./editable-phone-cell"

import { type Customer } from "@/hooks/queries/customers"
import { formatPhoneNumber } from "@/utils/formatters"
import { useUpdateCustomer } from "@/hooks/mutations/customers"
import { Id } from "../../../convex/_generated/dataModel"

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const { updateCustomerMutation } = useUpdateCustomer()
      const value = row.getValue("name") as string
      
      return (
        <EditableCell 
          value={value} 
          onSave={async (newValue) => {
            await updateCustomerMutation({
              _id: row.original._id as Id<"customers">,
              name: newValue
            })
          }} 
        />
      )
    }
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const { updateCustomerMutation } = useUpdateCustomer()
      const value = row.getValue("email") as string || ""
      
      return (
        <EditableCell 
          value={value} 
          onSave={async (newValue) => {
            await updateCustomerMutation({
              _id: row.original._id as Id<"customers">,
              email: newValue
            })
          }} 
        />
      )
    }
  },
  {
    accessorKey: "phone",
    header: "Telefone",
    cell: ({ row }) => {
      const { updateCustomerMutation } = useUpdateCustomer()
      const value = row.getValue("phone") as string
      
      return (
        <EditablePhoneCell 
          value={value} 
          onSave={async (newValue) => {
            await updateCustomerMutation({
              _id: row.original._id as Id<"customers">,
              phone: newValue
            })
          }} 
        />
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original
      return (
        <div className="flex justify-end">
          <CustomerRowActions customer={customer} />
        </div>
      )
    },
  },
]