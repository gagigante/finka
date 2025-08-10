import { ArrowUp, Building2, CheckCircle, UserCircle } from "lucide-react"

import { FacetedFilter } from "@/components/faceted-filter"

import { priorities } from "@/constants/priorities"
import { type Status, statuses } from "@/constants/statuses"

import { type Customer } from "@/hooks/queries/customers"

interface TaskAttributesProps {
  customers: Customer[]
  selectedAssignmentsIds: string[]
  selectedCustomersIds: string[]
  selectedPriority: string | undefined
  selectedStatus: Status | undefined
  onChangeAssignments: (ids: string[]) => void
  onChangeCustomers: (ids: string[]) => void
  onChangePriority: (priority: string) => void
  onChangeStatus: (status: Status) => void
}

export function TaskAttributes({
  customers,
  selectedAssignmentsIds,
  selectedCustomersIds,
  selectedPriority,
  selectedStatus,
  onChangeAssignments,
  onChangeCustomers,
  onChangePriority,
  onChangeStatus,
}: TaskAttributesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <FacetedFilter
        title="Responsáveis"
        placeholder="Pesquisar pelo nome..."
        options={[]}
        value={selectedAssignmentsIds}
        onChange={onChangeAssignments}
        triggerIcon={<UserCircle className="mr-2 h-4 w-4" />}
      />

      <FacetedFilter
        title="Clientes"
        placeholder="Pesquisar pelo nome..."
        options={customers.map(c => ({ label: c.name, value: c._id! }))}
        value={selectedCustomersIds}
        onChange={onChangeCustomers}
        triggerIcon={<Building2 className="mr-2 h-4 w-4" />}
      />

      <FacetedFilter
        title="Prioridade"
        options={priorities}
        value={selectedPriority ? [selectedPriority] : []}
        onChange={selectedPriority => onChangePriority(selectedPriority[0])}
        triggerIcon={<ArrowUp className="mr-2 h-4 w-4" />}
        multiple={false}
        showClearButton={false}
        showSearch={false}
      />

      <FacetedFilter
        title="Status"
        options={statuses.map(s => ({ label: s.label, value: s.value }))}
        value={selectedStatus ? [selectedStatus] : []}
        onChange={selectedStatus => onChangeStatus(selectedStatus[0] as Status)}
        triggerIcon={<CheckCircle className="mr-2 h-4 w-4" />}
        multiple={false}
        showClearButton={false}
        showSearch={false}
      />
    </div>
  )
}