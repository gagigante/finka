'use client'

import { useQuery as useConvexQuery } from 'convex/react'

import { api } from '../../../convex/_generated/api'

export interface Customer { 
  _id: string; 
  name: string; 
  email?: string 
  phone: string
}

export function useCustomers(): { data: Customer[] } {
  const response = useConvexQuery(api.customers.list)
  return { data: response ?? [] }
}