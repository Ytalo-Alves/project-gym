import {
  Contract,
  CreateContractData,
  ContractWithPlan,
} from "./contract.entity";

export interface ContractRepository {
  create(data: CreateContractData): Promise<ContractWithPlan>;
  findByStudentId(studentId: string): Promise<ContractWithPlan[]>;
  findActiveByStudentId(studentId: string): Promise<ContractWithPlan | null>;
  countByPlanId(planId: string): Promise<number>;
  countActiveContracts(): Promise<number>;
}
