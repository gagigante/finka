'use client'

import { Task } from "@/schemas/task-schema";
import { useQuery } from "@tanstack/react-query";

export function useTasks() {
  return useQuery<Task[]>({
    queryKey: ['todos'],
    queryFn: async () => {
      const res = await fetch('api/tasks')
      if (!res.ok) throw new Error('Failed to fetch todos')
      return res.json()
    }
  })
}