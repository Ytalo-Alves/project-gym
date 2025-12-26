import { api } from "./api";
import type {
  Plan,
  CreatePlanRequest,
  UpdatePlanRequest,
  PlanResponse,
} from "../types/plan.types";

export const planService = {
  async list(): Promise<Plan[]> {
    try {
      const response = await api.get<PlanResponse[]>("/plans");
      return response.map((plan) => ({
        ...plan,
        description: plan.description || undefined,
      }));
    } catch (err) {
      console.error("Erro ao listar planos:", err);
      // Retorna lista vazia para que a UI mostre mensagem de nenhum plano
      return [];
    }
  },

  async getById(id: string): Promise<Plan> {
    const response = await api.get<PlanResponse>(`/plans/${id}`);
    return {
      ...response,
      description: response.description || undefined,
    };
  },

  async create(data: CreatePlanRequest): Promise<Plan> {
    const response = await api.post<PlanResponse>("/plans", data);
    return {
      ...response,
      description: response.description || undefined,
    };
  },

  async update(id: string, data: UpdatePlanRequest): Promise<Plan> {
    const response = await api.put<PlanResponse>(`/plans/${id}`, data);
    return {
      ...response,
      description: response.description || undefined,
    };
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/plans/${id}`);
  },
};
