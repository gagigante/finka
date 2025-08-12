import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";

import { useCreateUser } from "./mutations/users";

import { type Id } from "../../convex/_generated/dataModel";

export function useStoreUserEffect() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  const { createUserMutation } = useCreateUser()

  const [userId, setUserId] = useState<Id<"users"> | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    async function createUser() {
      const id = await createUserMutation();
      setUserId(id);
    }

    createUser();

    return () => setUserId(null);
  }, [isAuthenticated, createUserMutation, user?.id]);

  return {
    isLoading: isLoading || (isAuthenticated && userId === null),
    isAuthenticated: isAuthenticated && userId !== null,
  };
}