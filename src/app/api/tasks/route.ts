export async function GET() { 
  const response = await fetch('http://localhost:3001/tasks')

  if (!response.ok) throw new Error('Failed to fetch todos')

  const data = await response.json()
  
  return Response.json(data)
}

export async function POST() {
  const res = await fetch('http://localhost:3001/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      {
        "id": "TASK-8782",
        "assign": {
          "id": "1",
          "name": "Gabriel Gigante",
          "avatar": "https://avatars.githubusercontent.com/u/48386738?v=4"
        },
        "title": "teste",
        "customer": {
          "id": "1",
          "name": "Gabriel Gigante"
        },
        "status": "todo",
        "label": "documentation",
        "priority": "low",
        "created_at": "2025-03-11T16:45:19.389Z"
      },
    )
  })

  if (!res.ok) throw new Error('Failed to add todo')

  return Response.json({ ok: true })
}