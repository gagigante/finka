import { z } from "zod";

export const taskSchema = z.object({
  id: z.string(),
  assign: z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string().nullable(),
  }).nullable(),
  title: z.string(),
  labels: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
  customer: z.object({
    id: z.string(),
    name: z.string(),
  }).nullable(),
  priority: z.string(),
  status: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  finished_at: z.string().datetime(),
})

export type Task = z.infer<typeof taskSchema>
