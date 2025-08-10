import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await ctx.auth.getUserIdentity()
    if (!authUser) {
      throw new Error("Unauthorized")
    }

    const query = ctx.db.query("users");
    return await query.collect();
  }
})

export const create = mutation({
  args: {},
  handler: async (ctx) => {
    const authUser = await ctx.auth.getUserIdentity()
    if (!authUser) {
      throw new Error("Unauthorized")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", authUser.tokenIdentifier),
      )
      .unique();

    if (user !== null) {
      if (user.name !== authUser.name) {
        await ctx.db.patch(user._id, { name: authUser.name });
      }

      return user._id;
    }

    return await ctx.db.insert("users", {
      name: authUser.name ?? "Anônimo",
      tokenIdentifier: authUser.tokenIdentifier,
    });
  },
});