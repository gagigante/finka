import { SignedIn, UserButton } from "@clerk/nextjs";

export function HomeHeader() {
  return (
    <div className="flex items-center justify-between space-y-2">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Bem-vindo de volta!</h2>
        <p className="text-muted-foreground">
          Está é a lista de tarefas disponíveis.
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <SignedIn>
          <UserButton />
        </SignedIn>

        {/* <UserNav /> */}
      </div>
    </div>
  )
}