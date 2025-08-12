import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.string(),
  }).index("tokenIdentifier", ["tokenIdentifier"]),

  customers: defineTable({
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
  }),

  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.optional(v.union(v.string(), v.null())),
    status: v.optional(v.union(v.string(), v.null())),
    created_at: v.string(),
    updated_at: v.optional(v.string()),
    finished_at: v.optional(v.string()),
  }).index("by_status", ["status"]).index("by_created_at", ["created_at"]),

  tasks_users: defineTable({
    taskId: v.id("tasks"),
    userId: v.id("users"),
  }).index("taskId", ["taskId"]).index("userId", ["userId"]),

  tasks_customers: defineTable({
    taskId: v.id("tasks"),
    customerId: v.id("customers"),
  }).index("taskId", ["taskId"]).index("customerId", ["customerId"]),
})
