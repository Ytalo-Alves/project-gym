export interface Plan {
  id: string;
  name: string;
  duration: number;
  price: number;
  description?: string | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePlanData {
  name: string;
  duration: number;
  price: number;
  description?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface UpdatePlanData {
  name?: string;
  duration?: number;
  price?: number;
  description?: string;
  status?: "ACTIVE" | "INACTIVE";
}
