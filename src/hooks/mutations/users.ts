import { useMutation } from "convex/react";

import { api } from "../../../convex/_generated/api";

export function useCreateUser() {
  const createUserMutation = useMutation(api.user.create);

  return { createUserMutation }
}
