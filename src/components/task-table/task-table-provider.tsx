"use client"

import { createContext, ReactNode, useEffect, useState } from 'react';
import {  
  type ColumnFiltersState,
  type SortingState,
  Table,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { columns } from './task-table-columns';

import { type Task } from "@/schemas/task-schema"

interface TaskTableProviderProps {
  children: ReactNode;
  data: Task[];
}

interface TaskTableContextValues {
  table: Table<Task>
}

export const TaskTableContext = createContext<TaskTableContextValues>({} as TaskTableContextValues);

export function TaskTableProvider({ children, data }: TaskTableProviderProps) {   
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  useEffect(() => {
    console.log({ columnFilters })
  }, [columnFilters])

  const table = useReactTable({
    data,
    columns,
    initialState: {
      columnVisibility: {
        labels: false,
      },
    },
    state: {
      sorting,      
      columnFilters,
    },
    enableRowSelection: true,    
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <TaskTableContext.Provider value={{ table }}>{children}</TaskTableContext.Provider>
  )
}
