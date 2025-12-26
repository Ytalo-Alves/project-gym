import { GetPlanUseCase } from "../app/get-plan.usecase";
import { PrismaPlanRepository } from "../infra/prisma-plan.repository";

export function makeGetPlanUseCase() {
  const planRepository = new PrismaPlanRepository();
  const getPlanUseCase = new GetPlanUseCase(planRepository);
  return getPlanUseCase;
}
