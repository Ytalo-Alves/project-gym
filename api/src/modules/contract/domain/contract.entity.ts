export interface Contract {
  id: string;
  studentId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  status: ContractStatus;
  pricePaid: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ContractStatus = "ACTIVE" | "PAUSED" | "CANCELED" | "EXPIRED";

export interface CreateContractData {
  studentId: string;
  planId: string;
  startDate?: Date;
  pricePaid: number;
  durationMonths: number;
}

export interface ContractWithPlan extends Contract {
  plan: {
    id: string;
    name: string;
    duration: number;
    price: number;
    description: string | null;
  };
}
