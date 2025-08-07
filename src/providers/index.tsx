'use client'

import { useState, type ReactNode } from "react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { TooltipProvider } from "@/components/ui/tooltip";
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ConvexReactClient } from 'convex/react'

interface ProvidersProps {
  children: ReactNode
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || 'http://localhost:3210', {
  unsavedChangesWarning: false,
})

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 1000,
        // refetchInterval: 2000,
      },
    },
  }))
  
  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <TooltipProvider>
            {children}
          </TooltipProvider>

          <ReactQueryDevtools initialIsOpen={false} />
        </ConvexProviderWithClerk>
      </QueryClientProvider>
    </ClerkProvider>
  )
}