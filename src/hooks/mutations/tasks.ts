import { useMutation } from "convex/react";

import { api } from "../../../convex/_generated/api";

export function useCreateTask() {
  const createTaskMutation = useMutation(api.tasks.create);

  return { createTaskMutation }
}

export function useUpdateTask() {
  const updateTaskMutation = useMutation(api.tasks.update);

  return { updateTaskMutation };
}

export function useRemoveTask() {
  const removeTaskMutation = useMutation(api.tasks.remove);

  return { removeTaskMutation };
}
