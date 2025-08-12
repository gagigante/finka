'use client'

// import { promises as fs } from "node:fs"
// import path from "node:path"
// import { z } from "zod"
// import { taskSchema } from "@/schemas/task-schema";
import { HomeHeader } from "@/components/home-header";
import { useTasks } from "@/hooks/queries/tasks";
import { DataTable } from "@/components/data-table";

import { TaskTable } from "@/components/task-table";

// Simulate a database read for tasks.
// async function getTasks() {
//   fetch('/api/tasks').then(response => response.json()).then(console.log)
//   // const data = await fs.readFile(
//   //   path.join(process.cwd(), "src/data/tasks.json")
//   // )

//   // const tasks = JSON.parse(data.toString())

//   // return z.array(taskSchema).parse(tasks)
// }

export default function Home() {
  const { data } = useTasks()

  return (
    <div className="flex w-full max-w-[1366px] h-full mx-auto">
      <div className="flex flex-1 flex-col space-y-8 p-8">
        <HomeHeader />

        <TaskTable.Root data={data ?? []}>
          <TaskTable.Toolbar />
          <DataTable />
        </TaskTable.Root>
      </div>
    </div>
  );
}
