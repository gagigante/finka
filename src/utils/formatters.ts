export function formatDate(date: Date) {
  const formatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' })

  return formatter.format(date)
}

export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '')

  if (digits.length <= 2) {
    return `(${digits}`
  } else if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  } else {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
  }
}