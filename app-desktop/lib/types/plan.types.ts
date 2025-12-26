export interface Plan {
  id: string;
  name: string;
  duration: number;
  price: number;
  description?: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePlanRequest {
  name: string;
  duration: number;
  price: number;
  description?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface UpdatePlanRequest {
  name?: string;
  duration?: number;
  price?: number;
  description?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface PlanResponse {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}
