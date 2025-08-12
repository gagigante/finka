import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const list = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await ctx.auth.getUserIdentity()
    if (!authUser) {
      throw new Error("Unauthorized")
    }

    const query = ctx.db.query("customers");
    return await query.collect();
  }
})

export const create = mutation({
  args: v.object({
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const authUser = await ctx.auth.getUserIdentity()
    if (!authUser) {
      throw new Error("Unauthorized")
    }

    const _id = await ctx.db.insert("customers", args)
    return { _id }
  }
})

export const update = mutation({
  args: v.object({
    _id: v.id("customers"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const authUser = await ctx.auth.getUserIdentity()
    if (!authUser) {
      throw new Error("Unauthorized")
    }

    await ctx.db.patch(args._id, args)
  }
})

export const remove = mutation({
  args: v.object({
    _id: v.id("customers"),
  }),
  handler: async (ctx, args) => {
    const relatedTaskCustomers = await ctx.db
      .query("tasks_customers")
      .withIndex("customerId", q => q.eq("customerId", args._id))
      .collect();

    for (const relation of relatedTaskCustomers) {
      await ctx.db.delete(relation._id);
    }
    
    await ctx.db.delete(args._id);
  }
})