import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const list = query({
  args: {},
  handler: async (ctx) => {
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
    const _id = await ctx.db.insert("customers", args)
    return { _id }
  }
})