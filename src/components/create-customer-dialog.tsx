"use client"

import { useState } from "react"
import { useMutation } from 'convex/react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { api } from "../../convex/_generated/api"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { formatPhoneNumber } from "@/utils/formatters"

const createCustomerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  email: z.union([z.email("E-mail inválido"), z.string().length(0)]).optional(),
})

type CreateCustomerForm = z.infer<typeof createCustomerSchema>

export function CreateCustomerDialog() {
  const [open, setOpen] = useState(false)
  const createCustomer = useMutation(api.customers.create)

  const form = useForm<CreateCustomerForm>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    }
  })

  async function handleSubmit({name, phone, email}: CreateCustomerForm) {
    const rawPhone = phone.replace(/\D/g, "")
    const payload = {
      name,
      phone: rawPhone,
      email: email || undefined
    }

    await createCustomer(payload)
    form.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(open) => {
      setOpen(open)
      form.reset()
    }}>
      <DialogTrigger asChild>
        <Button size="sm">Cadastrar cliente</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cadastrar novo cliente</DialogTitle>
          <VisuallyHidden>
            <DialogDescription>
              Preencha os dados do cliente para cadastrá-lo no sistema.
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <Label 
              htmlFor="name" 
              className={form.formState.errors.name ? "text-red-500" : ""}
            >
              Nome
            </Label>
            <Input 
              id="name"
              {...form.register("name")} 
              className="mt-2"
              aria-invalid={!!form.formState.errors.name}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <Label 
              htmlFor="phone"
              className={form.formState.errors.phone ? "text-red-500" : ""}
            >
              Telefone
            </Label>
            <Input
              id="phone"
              type="tel" 
              className="mt-2"
              placeholder="(11) 99999-9999"
              {...form.register("phone", {
                onChange: (e) => {
                  const formatted = formatPhoneNumber(e.target.value)
                  e.target.value = formatted
                  form.setValue("phone", formatted)
                }
              })}
              maxLength={15}
              aria-invalid={!!form.formState.errors.phone}
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.phone.message}</p>
            )}
          </div>
          <div>
            <Label 
              htmlFor="email"
              className={form.formState.errors.email ? "text-red-500" : ""}
            >
              Email <span className="text-muted-foreground font-normal text-xs">(opcional)</span>
            </Label>
            <Input 
              id="email"
              type="email" 
              {...form.register("email")} 
              className="mt-2"
              aria-invalid={!!form.formState.errors.email}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="submit" size="sm" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
              )}
              Criar cliente
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}