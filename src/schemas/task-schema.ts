export interface Label {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface Customer {
  id: string;
  name: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: string | null | undefined;
  priority: string | null | undefined;
  created_at: string;
  updated_at: string;
  finished_at?: string;
  labels?: Label[];
  // Additional fields for all related users and customers
  users?: User[];
  customers?: Customer[];
}