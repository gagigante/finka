import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useTasksMutations() {
  const queryClient = useQueryClient()

  const addTodoMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify(
        //   {
        //     "id": "TASK-8782",
        //     "assign": {
        //       "id": "1",
        //       "name": "Gabriel Gigante",
        //       "avatar": "https://avatars.githubusercontent.com/u/48386738?v=4"
        //     },
        //     "title": "teste",
        //     "customer": {
        //       "id": "1",
        //       "name": "Gabriel Gigante"
        //     },
        //     "status": "todo",
        //     "label": "documentation",
        //     "priority": "low",
        //     "created_at": "2025-03-11T16:45:19.389Z"
        //   },
        // )
      })
      if (!res.ok) throw new Error('Failed to add todo')
      return res.json()
    },
    // When mutate is called:
    // onMutate: async (newTitle) => {
    //   // Cancel any outgoing refetches
    //   await queryClient.cancelQueries({ queryKey: ['todos'] })
      
    //   // Snapshot the previous value
    //   const previousTodos = queryClient.getQueryData(['todos'])
      
    //   // Optimistically update to the new value
    //   queryClient.setQueryData(['todos'], old => [
    //     { 
    //       id: 'temp-' + Date.now(), 
    //       title: newTitle, 
    //       completed: false, 
    //       createdAt: new Date().toISOString() 
    //     }, 
    //     ...old
    //   ])
      
    //   // Return a context object with the snapshotted value
    //   return { previousTodos }
    // },
    // // If the mutation fails, use the context returned from onMutate to roll back
    // onError: (err, newTitle, context) => {
    //   queryClient.setQueryData(['todos'], context.previousTodos)
    // },
    // // Always refetch after error or success:
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: ['todos'] })
    // },
  })

  return { addTodoMutation }
}