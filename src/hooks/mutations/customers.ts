import { useMutation } from "convex/react"

import { api } from "../../../convex/_generated/api"

export function useCreateCustomer() {
  const createCustomerMutation = useMutation(api.customers.create);

  return { createCustomerMutation }
}

export function useUpdateCustomer() {
  const updateCustomerMutation = useMutation(api.customers.update);

  return { updateCustomerMutation }
}

export function useRemoveCustomer() {
  const removeCustomerMutation = useMutation(api.customers.remove);

  return { removeCustomerMutation }
}