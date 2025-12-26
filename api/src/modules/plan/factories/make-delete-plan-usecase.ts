import { DeletePlanUseCase } from "../app/delete-plan.usecase";
import { PrismaPlanRepository } from "../infra/prisma-plan.repository";
import { PrismaContractRepository } from "../../contract/infra/prisma-contract.repository";

export function makeDeletePlanUseCase() {
  const planRepository = new PrismaPlanRepository();
  const contractRepository = new PrismaContractRepository();
  const deletePlanUseCase = new DeletePlanUseCase(
    planRepository,
    contractRepository
  );
  return deletePlanUseCase;
}
