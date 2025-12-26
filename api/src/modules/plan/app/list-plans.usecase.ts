import { Plan } from "../domain/plan.entity";
import { PlanRepository } from "../domain/plan.repository";

export class ListPlansUseCase {
  constructor(private planRepository: PlanRepository) {}

  async execute(): Promise<Plan[]> {
    return this.planRepository.findAll();
  }
}
