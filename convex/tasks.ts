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
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.optional(v.string()),
    status: v.optional(v.string()),
    created_at: v.string(),
    updated_at: v.optional(v.string()),
    finished_at: v.optional(v.string()),
    customersIds: v.array(v.id("customers")),
  }),
  handler: async (ctx, { customersIds, ...args}) => {
    const docId = await ctx.db.insert("tasks", args)

    for (const customerId of customersIds) {
      await ctx.db.insert("tasks_customers", { taskId: docId, customerId });
    }

    return { _id: docId }
  }
})
