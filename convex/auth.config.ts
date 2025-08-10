export default {
  providers: [
    {
      // Clerk issuer domain from your Clerk "convex" JWT template
      // Configure this value as CLERK_JWT_ISSUER_DOMAIN in the Convex dashboard
      domain: process.env.CLERK_FRONTEND_API_URL,
      applicationID: "convex",
    },
  ],
}

