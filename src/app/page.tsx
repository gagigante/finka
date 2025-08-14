'use client'

import { useStoreUserEffect } from "@/hooks/use-store-user-effect";
import { useTasks } from "@/hooks/queries/tasks";

import { AppHeader } from "@/components/app-header";
import { TaskTable } from "@/components/task-table";
import { DataTable } from "@/components/data-table";

export default function Home() {
  useStoreUserEffect()

  const { data } = useTasks()

  return (
    <div className="flex w-full max-w-[1366px] h-full mx-auto">
      <div className="flex flex-1 flex-col space-y-8 p-8">
        <AppHeader title="Tarefas" description="Gerencie as tarefas do sistema"/>

        <TaskTable.Root data={data ?? []}>
          <TaskTable.Toolbar />
          <DataTable />
        </TaskTable.Root>
      </div>
    </div>
  );
}
