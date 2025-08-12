'use client'

import { useQuery as useConvexQuery } from 'convex/react'

import { api } from '../../../convex/_generated/api'

import { type Id } from '../../../convex/_generated/dataModel';

export interface User { 
  _id: Id<"users">;
  name: string
}

export function useUsers(): { data: User[] } {
  const response = useConvexQuery(api.user.list)
  return { data: response ?? [] }
}