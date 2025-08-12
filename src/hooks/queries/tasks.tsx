"use client"

import { Task as TaskSchema } from "@/schemas/task-schema";
import { useQuery as useConvexQuery } from 'convex/react'
import { api } from "../../../convex/_generated/api"

export type Task = TaskSchema

export function useTasks() {
  const data = useConvexQuery(api.tasks.list) as unknown as Task[] | undefined
  return { data }
}