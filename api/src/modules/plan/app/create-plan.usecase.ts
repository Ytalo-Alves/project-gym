import { CreatePlanData, Plan } from "../domain/plan.entity";
import { PlanRepository } from "../domain/plan.repository";

export class CreatePlanUseCase {
  constructor(private planRepository: PlanRepository) {}

  async execute(data: CreatePlanData): Promise<Plan> {
    return this.planRepository.create(data);
  }
}
