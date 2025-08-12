'use client'

import { type ReactNode } from "react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'

import { TooltipProvider } from "@/components/ui/tooltip";

interface ProvidersProps {
  children: ReactNode
}

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file')
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL, {
  unsavedChangesWarning: false,
})

export function Providers({ children }: ProvidersProps) {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}