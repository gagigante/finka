'use client'

import { Task } from "@/schemas/task-schema";
import { useQuery } from "@tanstack/react-query";
// import { useQuery as useConvexQuery } from 'convex/react'
// import { api } from '@/convex/_generated/api'

export function useTasks() {
  // Realtime (Convex) version to be used after backend migration:
  // const data = useConvexQuery(api.tasks.list) as Task[] | undefined
  // return { data }

  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await fetch('api/tasks')
      if (!res.ok) throw new Error('Failed to fetch tasks')
      return res.json()
    }
  })
}