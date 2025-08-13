"use client"

import * as React from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { useRemoveCustomer } from "@/hooks/mutations/customers"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import { type Customer } from "@/hooks/queries/customers"
import { type Id } from "../../../convex/_generated/dataModel"

interface DeleteCustomerDialogProps {
  customer: Customer | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteCustomerDialog({ 
  customer, 
  open, 
  onOpenChange,
}: DeleteCustomerDialogProps) {
  const { removeCustomerMutation } = useRemoveCustomer()
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async () => {
    if (!customer) return
    
    try {
      setIsDeleting(true)
      await removeCustomerMutation({ _id: customer._id as Id<"customers"> })
      onOpenChange(false)
      toast.success("Cliente excluído com sucesso")
    } catch {
      toast.error("Erro ao excluir cliente. Tente novamente.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!isDeleting) {
      onOpenChange(open)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={!isDeleting}>
        <DialogHeader>
          <DialogTitle>Excluir cliente</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o cliente {customer?.name}? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={isDeleting}
            size="sm"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Excluir
          </Button>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}