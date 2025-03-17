export function formatDate(date: Date) {
  const formatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' })

  return formatter.format(date)
}