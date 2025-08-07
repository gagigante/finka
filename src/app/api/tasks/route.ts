// TODO: Migrar este endpoint para Convex (queries/mutations reais) e remover json-server.
export async function GET() { 
  const response = await fetch('http://localhost:3001/tasks')

  if (!response.ok) throw new Error('Failed to fetch todos')

  const data = await response.json()
  
  return Response.json(data)
}

export async function POST(request: Request) {
  const payload = await request.json()

  const res = await fetch('http://localhost:3001/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload }),
  })

  if (!res.ok) throw new Error('Failed to add todo')

  const data = await res.json()
  return Response.json(data)
}