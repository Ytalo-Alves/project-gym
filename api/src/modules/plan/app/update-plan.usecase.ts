import { Plan, UpdatePlanData } from "../domain/plan.entity";
import { PlanRepository } from "../domain/plan.repository";
import { PlanNotFound } from "../../../core/errors/plan-not-found";

export class UpdatePlanUseCase {
  constructor(private planRepository: PlanRepository) {}

  async execute(id: string, data: UpdatePlanData): Promise<Plan> {
    const plan = await this.planRepository.findById(id);
    if (!plan) {
      throw new PlanNotFound();
    }

    return this.planRepository.update(id, data);
  }
}
