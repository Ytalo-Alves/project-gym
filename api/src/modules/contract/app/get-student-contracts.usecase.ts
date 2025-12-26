import { ContractWithPlan } from "../domain/contract.entity";
import { ContractRepository } from "../domain/contract.repository";

export class GetStudentContractsUseCase {
  constructor(private contractRepository: ContractRepository) {}

  async execute(studentId: string): Promise<ContractWithPlan[]> {
    return this.contractRepository.findByStudentId(studentId);
  }
}
