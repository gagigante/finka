import { CustomerTableProvider } from "./customer-table-provider"
import { CustomerTableToolbar } from "./customer-table-toolbar"
import { CustomerDataTable } from "./customer-data-table"

export const CustomerTable = {
  Root: CustomerTableProvider,
  Toolbar: CustomerTableToolbar,
  DataTable: CustomerDataTable,
}