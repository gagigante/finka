'use client'

import { Authenticated } from "convex/react";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <Authenticated>
      {children}
    </Authenticated>
  )
}