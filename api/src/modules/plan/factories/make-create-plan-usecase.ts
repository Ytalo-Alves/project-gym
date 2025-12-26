import { CreatePlanUseCase } from "../app/create-plan.usecase";
import { PrismaPlanRepository } from "../infra/prisma-plan.repository";

export function makeCreatePlanUseCase() {
  const planRepository = new PrismaPlanRepository();
  const createPlanUseCase = new CreatePlanUseCase(planRepository);
  return createPlanUseCase;
}
