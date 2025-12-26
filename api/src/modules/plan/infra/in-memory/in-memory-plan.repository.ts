import { CreatePlanData, Plan, UpdatePlanData } from "../../domain/plan.entity";
import { PlanRepository } from "../../domain/plan.repository";
import { randomUUID } from "node:crypto";

export class InMemoryPlanRepository implements PlanRepository {
  public items: Plan[] = [];

  async create(data: CreatePlanData): Promise<Plan> {
    const plan: Plan = {
      id: randomUUID(),
      ...data,
      description: data.description ?? null,
      status: data.status ?? "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.push(plan);
    return plan;
  }

  async findAll(): Promise<Plan[]> {
    return this.items;
  }

  async findById(id: string): Promise<Plan | null> {
    const plan = this.items.find((item) => item.id === id);
    return plan || null;
  }

  async update(id: string, data: UpdatePlanData): Promise<Plan> {
    const planIndex = this.items.findIndex((item) => item.id === id);

    if (planIndex === -1) {
      throw new Error("Plan not found");
    }

    const plan = this.items[planIndex];

    const updatedPlan: Plan = {
      ...plan,
      ...data,
      updatedAt: new Date(),
    };

    this.items[planIndex] = updatedPlan;

    return updatedPlan;
  }

  async delete(id: string): Promise<void> {
    const planIndex = this.items.findIndex((item) => item.id === id);

    if (planIndex !== -1) {
      this.items.splice(planIndex, 1);
    }
  }
}
