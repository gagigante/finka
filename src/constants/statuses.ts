import { CheckCircle, Circle, CircleOff, Timer } from "lucide-react";

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
]