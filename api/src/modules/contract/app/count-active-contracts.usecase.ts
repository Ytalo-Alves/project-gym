import { ContractRepository } from "../domain/contract.repository";

export class CountActiveContractsUseCase {
  constructor(private contractRepository: ContractRepository) {}

  async execute(): Promise<number> {
    return this.contractRepository.countActiveContracts();
  }
}

