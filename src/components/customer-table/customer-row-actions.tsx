"use client"

import * as React from "react"
import { Eye, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DeleteCustomerDialog } from "./delete-customer-dialog"

import { type Customer } from "@/hooks/queries/customers"

interface CustomerRowActionsProps {
  customer: Customer
  onView?: (customer: Customer) => void
  onEdit?: (customer: Customer) => void
}

export function CustomerRowActions({ customer, onView, onEdit }: CustomerRowActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  
  return (
    <>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" 
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Excluir cliente</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      <DeleteCustomerDialog 
        customer={customer}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  )
}