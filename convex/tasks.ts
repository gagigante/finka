import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").withIndex("by_created_at").collect()
  }
})

export const create = mutation({
  args: v.object({
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
    attachments: v.optional(v.array(v.object({ storageId: v.optional(v.id("_storage")), filename: v.string(), size: v.number(), type: v.optional(v.string()) }))),
  }),
  handler: async (ctx, args) => {
    const docId = await ctx.db.insert("tasks", args)
    return { _id: docId }
  }
})

export const assignResponsible = mutation({
  args: v.object({
    taskId: v.id("tasks"),
    assign: v.object({ id: v.string(), name: v.string(), avatar: v.optional(v.string()) })
  }),
  handler: async (ctx, { taskId, assign }) => {
    await ctx.db.patch(taskId, { assign })
  }
})

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl()
  }
})

export const attachFile = mutation({
  args: v.object({
    taskId: v.id("tasks"),
    storageId: v.id("_storage"),
    filename: v.string(),
    size: v.number(),
    type: v.optional(v.string()),
  }),
  handler: async (ctx, { taskId, storageId, filename, size, type }) => {
    const task = await ctx.db.get(taskId)
    if (!task) throw new Error("Task not found")
    const next = [...(task.attachments ?? []), { storageId, filename, size, type }]
    await ctx.db.patch(taskId, { attachments: next })
  }
})