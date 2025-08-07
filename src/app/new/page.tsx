"use client"

import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { priorities } from "@/constants/priorities"
import { statuses } from "@/constants/statuses"
// import { useMutation } from 'convex/react'
// import { api } from '@/convex/_generated/api'

interface Customer { id: string; name: string }
interface Label { id: string; name: string }

export default function Page() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [responsavelName, setResponsavelName] = useState("")
  const [responsavelId, setResponsavelId] = useState("")
  const [customerId, setCustomerId] = useState<string>("")
  const [priority, setPriority] = useState<string>("medium")
  const [status, setStatus] = useState<string>("todo")
  const [labels, setLabels] = useState<Label[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [files, setFiles] = useState<FileList | null>(null)

  // const generateUploadUrl = useMutation(api.tasks.generateUploadUrl)
  // const createTask = useMutation(api.tasks.create)

  useEffect(() => {
    fetch('/api/customers').then(r => r.json()).then(setCustomers)
  }, [])

  const selectedCustomer = useMemo(() => customers.find(c => c.id === customerId) || null, [customers, customerId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const id = `TASK-${Math.random().toString(36).slice(2,6).toUpperCase()}${Date.now().toString().slice(-2)}`

    const attachments = files ? Array.from(files).map(f => ({ filename: f.name, size: f.size, type: f.type })) : []

    const payload = {
      id,
      assign: responsavelId || responsavelName ? { id: responsavelId || 'custom', name: responsavelName || 'Responsável', avatar: null } : null,
      title,
      labels,
      customer: selectedCustomer ? { id: selectedCustomer.id, name: selectedCustomer.name } : null,
      priority,
      status,
      attachments,
      created_at: new Date().toISOString(),
      updated_at: null,
      finished_at: null,
    }

    // Convex version (with file upload):
    // let uploaded: { storageId?: string, filename: string, size: number, type?: string }[] = []
    // for (const file of Array.from(files ?? [])) {
    //   const url = await generateUploadUrl({})
    //   const blob = file
    //   const res = await fetch(url, { method: 'POST', body: blob, headers: file.type ? { 'Content-Type': file.type } : {} })
    //   const { storageId } = await res.json()
    //   uploaded.push({ storageId, filename: file.name, size: file.size, type: file.type })
    // }
    // await createTask({ ...payload, attachments: uploaded })

    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    router.push('/')
  }

  return (
    <div className="p-6 w-full max-w-2xl">
      <h1 className="text-xl font-semibold mb-4">Criar tarefa</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Título</label>
          <Input value={title} onChange={e => setTitle(e.target.value)} required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Responsável (ID)</label>
            <Input value={responsavelId} onChange={e => setResponsavelId(e.target.value)} placeholder="user_..." />
          </div>
          <div>
            <label className="text-sm font-medium">Responsável (Nome)</label>
            <Input value={responsavelName} onChange={e => setResponsavelName(e.target.value)} placeholder="Nome" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Cliente</label>
          <Select onValueChange={setCustomerId} value={customerId}>
            <SelectTrigger><SelectValue placeholder="Selecione um cliente" /></SelectTrigger>
            <SelectContent>
              {customers.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Prioridade</label>
            <Select onValueChange={setPriority} value={priority}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {priorities.map(p => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Status</label>
            <Select onValueChange={setStatus} value={status}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {statuses.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Anexos</label>
          <Input type="file" multiple onChange={e => setFiles(e.target.files)} />
        </div>

        <div className="flex gap-2">
          <Button type="submit">Salvar</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
        </div>
      </form>
    </div>
  )
}