import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useTasksMutations() {
  const queryClient = useQueryClient()

  const createTask = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch('api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Failed to create task')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  return { createTask }
}