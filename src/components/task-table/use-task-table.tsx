import { useContext } from "react";

import { TaskTableContext } from "@/components/task-table/task-table-provider";

export function useTaskTable() {
  return useContext(TaskTableContext)
}
