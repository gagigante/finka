import { Authenticated, Unauthenticated } from 'convex/react'
import { SignInButton, UserButton } from "@clerk/nextjs";

interface AppHeaderProps {
  title: string
  description?: string
}

export function AppHeader({ title, description }: AppHeaderProps) {
  return (
    <div className="flex items-center justify-between space-y-2">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Authenticated>
          <UserButton />
        </Authenticated>
      </div>
    </div>
  )
}