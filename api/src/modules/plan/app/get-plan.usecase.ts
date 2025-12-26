import { Plan } from "../domain/plan.entity";
import { PlanRepository } from "../domain/plan.repository";
import { PlanNotFound } from "../../../core/errors/plan-not-found";

export class GetPlanUseCase {
  constructor(private planRepository: PlanRepository) {}

  async execute(id: string): Promise<Plan> {
    const plan = await this.planRepository.findById(id);
    if (!plan) {
      throw new PlanNotFound();
    }
    return plan;
  }
}
