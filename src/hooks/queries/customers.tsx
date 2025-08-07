'use client'

import { useQuery } from '@tanstack/react-query'
// import { useQuery as useConvexQuery } from 'convex/react'
// import { api } from '@/convex/_generated/api'

export interface Customer { id?: string; _id?: string; name: string; email?: string }

export function useCustomers() {
  // const data = useConvexQuery(api.customers.list)
  // return { data }

  return useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: async () => {
      const res = await fetch('/api/customers')
      if (!res.ok) throw new Error('Failed to fetch customers')
      return res.json()
    }
  })
}