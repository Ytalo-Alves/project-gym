export interface Contract {
  id: string;
  studentId: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  pricePaid: number;
  createdAt: string;
  updatedAt: string;
  plan: Plan;
}

export type ContractStatus = "ACTIVE" | "PAUSED" | "CANCELED" | "EXPIRED";

export interface Plan {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContractRequest {
  studentId: string;
  planId: string;
  startDate?: string;
  pricePaid: number;
  durationMonths: number;
}
