import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  }).index("by_token", ["tokenIdentifier"]),

  customers: defineTable({
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
  }),

  labels: defineTable({
    name: v.string(),
  }),

  tasks: defineTable({
    // IDs stored as strings for compatibility with existing UI
    id: v.string(),
    title: v.string(),
    priority: v.string(),
    status: v.string(),
    created_at: v.string(),
    updated_at: v.optional(v.string()),
    finished_at: v.optional(v.string()),

    assign: v.optional(v.object({ id: v.string(), name: v.string(), avatar: v.optional(v.string()) })),
    customer: v.optional(v.object({ id: v.string(), name: v.string() })),
    labels: v.optional(v.array(v.object({ id: v.string(), name: v.string() }))),

    attachments: v.optional(v.array(v.object({
      storageId: v.optional(v.id("_storage")),
      filename: v.string(),
      size: v.number(),
      type: v.optional(v.string()),
    }))),
  }).index("by_status", ["status"]).index("by_created_at", ["created_at"]),
})