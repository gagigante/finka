import { useMutation } from "convex/react";

import { api } from "../../../convex/_generated/api";

export function useCreateTask() {
  const createTaskMutation = useMutation(api.tasks.create);

  return { createTaskMutation }
}
