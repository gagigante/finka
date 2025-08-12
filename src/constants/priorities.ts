import { ArrowDown, ArrowRight, ArrowUp, Minus } from "lucide-react";

export const emptyPriority = {
  label: "N/A",
  value: null,
  icon: Minus,
}

export const priorities = [
  {
    label: "Baixa",
    value: "low",
    icon: ArrowDown,
  },
  {
    label: "Média",
    value: "medium",
    icon: ArrowRight,
  },
  {
    label: "Alta",
    value: "high",
    icon: ArrowUp,
  },
]
