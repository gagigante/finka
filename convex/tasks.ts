import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const list = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await ctx.auth.getUserIdentity()
    if (!authUser) {
      throw new Error("Unauthorized")
    }

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
    usersIds: v.array(v.id("users")),
  }),
  handler: async (ctx, { customersIds, usersIds, ...args}) => {
    const authUser = await ctx.auth.getUserIdentity()
    if (!authUser) {
      throw new Error("Unauthorized")
    }

    const docId = await ctx.db.insert("tasks", args)

    for (const customerId of customersIds) {
      await ctx.db.insert("tasks_customers", { taskId: docId, customerId });
    }

    for (const userId of usersIds) {
      await ctx.db.insert("tasks_users", { taskId: docId, userId });
    }

    return { _id: docId }
  }
})

export const remove = mutation({
  args: v.object({
    _id: v.id("tasks"),
  }),
  handler: async (ctx, args) => {
    const authUser = await ctx.auth.getUserIdentity()
    if (!authUser) {
      throw new Error("Unauthorized")
    }

    const taskCustomerRelations = await ctx.db
      .query("tasks_customers")
      .withIndex("taskId", q => q.eq("taskId", args._id))
      .collect();
    
    for (const relation of taskCustomerRelations) {
      await ctx.db.delete(relation._id);
    }
    
    const taskUserRelations = await ctx.db
      .query("tasks_users")
      .withIndex("taskId", q => q.eq("taskId", args._id))
      .collect();
    
    for (const relation of taskUserRelations) {
      await ctx.db.delete(relation._id);
    }

    await ctx.db.delete(args._id);
  }
})

