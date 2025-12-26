import { UpdatePlanUseCase } from "../app/update-plan.usecase";
import { PrismaPlanRepository } from "../infra/prisma-plan.repository";

export function makeUpdatePlanUseCase() {
  const planRepository = new PrismaPlanRepository();
  const updatePlanUseCase = new UpdatePlanUseCase(planRepository);
  return updatePlanUseCase;
}
