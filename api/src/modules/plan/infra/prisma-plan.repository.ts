import { prisma } from "../../../infra/prisma";
import { CreatePlanData, Plan, UpdatePlanData } from "../domain/plan.entity";
import { PlanRepository } from "../domain/plan.repository";

export class PrismaPlanRepository implements PlanRepository {
  async create(data: CreatePlanData): Promise<Plan> {
    const plan = await prisma.plan.create({
      data: {
        ...data,
        price: data.price, // Prisma Decimal handling might be needed if strict typing, but usually number works for input if configured
      },
    });
    // We need to convert Decimal to number for the entity if Prisma returns Decimal
    return {
      ...plan,
      price: Number(plan.price),
    } as Plan;
  }

  async findAll(): Promise<Plan[]> {
    const plans = await prisma.plan.findMany();
    return plans.map((plan) => ({
      ...plan,
      price: Number(plan.price),
    })) as Plan[];
  }

  async findById(id: string): Promise<Plan | null> {
    const plan = await prisma.plan.findUnique({
      where: { id },
    });
    if (!plan) return null;
    return {
      ...plan,
      price: Number(plan.price),
    } as Plan;
  }

  async update(id: string, data: UpdatePlanData): Promise<Plan> {
    const plan = await prisma.plan.update({
      where: { id },
      data,
    });
    return {
      ...plan,
      price: Number(plan.price),
    } as Plan;
  }

  async delete(id: string): Promise<void> {
    await prisma.plan.delete({
      where: { id },
    });
  }
}
