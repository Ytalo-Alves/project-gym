import { CreatePlanData, Plan, UpdatePlanData } from "./plan.entity";

export interface PlanRepository {
  create(data: CreatePlanData): Promise<Plan>;
  findAll(): Promise<Plan[]>;
  findById(id: string): Promise<Plan | null>;
  update(id: string, data: UpdatePlanData): Promise<Plan>;
  delete(id: string): Promise<void>;
}
