import { PlanRepository } from "../domain/plan.repository";
import { ContractRepository } from "../../contract/domain/contract.repository";
import { PlanNotFound } from "../../../core/errors/plan-not-found";
import { PlanHasContracts } from "../../../core/errors/plan-has-contracts";

export class DeletePlanUseCase {
  constructor(
    private planRepository: PlanRepository,
    private contractRepository: ContractRepository
  ) {}

  async execute(id: string): Promise<void> {
    try {
      const plan = await this.planRepository.findById(id);
      if (!plan) {
        throw new PlanNotFound();
      }

      // Verificar se o plano tem contratos associados
      const contractsCount = await this.contractRepository.countByPlanId(id);

      if (contractsCount > 0) {
        throw new PlanHasContracts();
      }

      await this.planRepository.delete(id);
    } catch (error: any) {
      // Se já for um AppError, re-lançar
      if (error instanceof PlanNotFound || error instanceof PlanHasContracts) {
        throw error;
      }

      // Logar erro desconhecido e re-lançar
      console.error("Erro ao deletar plano:", error);
      throw error;
    }
  }
}
