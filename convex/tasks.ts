import { v } from "convex/values"

import { mutation, query } from "./_generated/server"

export const list = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await ctx.auth.getUserIdentity()
    if (!authUser) {
      throw new Error("Unauthorized")
    }

    const tasks = await ctx.db.query("tasks").withIndex("by_created_at").collect()
    
    const tasksWithRelations = await Promise.all(
      tasks.map(async (task) => {
        const taskUserRelations = await ctx.db
          .query("tasks_users")
          .withIndex("taskId", q => q.eq("taskId", task._id))
          .collect()
        
        const userIds = taskUserRelations.map(relation => relation.userId)
        const usersWithNull = userIds.length > 0 
          ? await Promise.all(userIds.map(userId => ctx.db.get(userId)))
          : []

        const users = usersWithNull.filter(Boolean) as Array<{
          _id: string;
          name: string;
          avatar?: string;
        }>
        
        const taskCustomerRelations = await ctx.db
          .query("tasks_customers")
          .withIndex("taskId", q => q.eq("taskId", task._id))
          .collect()
        
        const customerIds = taskCustomerRelations.map(relation => relation.customerId)
        const customersWithNull = customerIds.length > 0
          ? await Promise.all(customerIds.map(customerId => ctx.db.get(customerId)))
          : []

        const customers = customersWithNull.filter(Boolean) as Array<{
          _id: string;
          name: string;
        }>
        
        return {
          ...task,
          users: users.map(user => ({
            id: user._id,
            name: user.name,
            avatar: user.avatar
          })),
          customers: customers.map(customer => ({
            id: customer._id,
            name: customer.name
          }))
        }
      })
    )
    
    return tasksWithRelations
  }
})

export const create = mutation({
  args: v.object({
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.optional(v.union(v.string(), v.null())),
    status: v.optional(v.union(v.string(), v.null())),
    created_at: v.string(),
    updated_at: v.optional(v.string()),
    finished_at: v.optional(v.string()),
    files: v.optional(v.array(v.object({
      id: v.string(),
      name: v.string(),
      url: v.string(),
      size: v.number(),
      type: v.string(),
      uploadedAt: v.string(),
    }))),
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

export const update = mutation({
  args: v.object({
    _id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    priority: v.optional(v.union(v.string(), v.null())),
    status: v.optional(v.union(v.string(), v.null())),
    updated_at: v.optional(v.string()),
    finished_at: v.optional(v.string()),
    files: v.optional(v.array(v.object({
      id: v.string(),
      name: v.string(),
      url: v.string(),
      size: v.number(),
      type: v.string(),
      uploadedAt: v.string(),
    }))),
    customersIds: v.optional(v.array(v.id("customers"))),
    usersIds: v.optional(v.array(v.id("users"))),
  }),
  handler: async (ctx, { _id, customersIds, usersIds, ...args }) => {
    const authUser = await ctx.auth.getUserIdentity()
    if (!authUser) {
      throw new Error("Unauthorized")
    }

    // Update the task document
    await ctx.db.patch(_id, args)

    // Update customer relations if provided
    if (customersIds) {
      // Delete existing relations
      const existingCustomerRelations = await ctx.db
        .query("tasks_customers")
        .withIndex("taskId", q => q.eq("taskId", _id))
        .collect()
      
      for (const relation of existingCustomerRelations) {
        await ctx.db.delete(relation._id)
      }
      
      // Create new relations
      for (const customerId of customersIds) {
        await ctx.db.insert("tasks_customers", { taskId: _id, customerId })
      }
    }

    // Update user relations if provided
    if (usersIds) {
      // Delete existing relations
      const existingUserRelations = await ctx.db
        .query("tasks_users")
        .withIndex("taskId", q => q.eq("taskId", _id))
        .collect()
      
      for (const relation of existingUserRelations) {
        await ctx.db.delete(relation._id)
      }
      
      // Create new relations
      for (const userId of usersIds) {
        await ctx.db.insert("tasks_users", { taskId: _id, userId })
      }
    }

    return { _id }
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

