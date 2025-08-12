import { CheckCircle, Circle, CircleDashed, CircleOff, Timer } from "lucide-react";

export const emptyStatus = {
  label: "N/A",
  value: null,
  icon: CircleDashed,
}

export const statuses = [
  {
    value: "todo",
    label: "A fazer",
    icon: Circle,
  },
  {
    value: "in_progress",
    label: "Em andamento",
    icon: Timer,
  },
  {
    value: "done",
    label: "Feito",
    icon: CheckCircle,
  },
  {
    value: "canceled",
    label: "Cancelado",
    icon: CircleOff,
  },
] as const

export type Status = (typeof statuses)[number]["value"]