import { ListPlansUseCase } from "../app/list-plans.usecase";
import { PrismaPlanRepository } from "../infra/prisma-plan.repository";

export function makeListPlansUseCase() {
  const planRepository = new PrismaPlanRepository();
  const listPlansUseCase = new ListPlansUseCase(planRepository);
  return listPlansUseCase;
}
