import {
  CreateContractData,
  ContractWithPlan,
} from "../domain/contract.entity";
import { ContractRepository } from "../domain/contract.repository";
import { StudentRepository } from "../../student/domain/student.repository";
import { PlanRepository } from "../../plan/domain/plan.repository";
import { StudentNotFoundError } from "../../../core/errors/student-not-found";
import { PlanNotFound } from "../../../core/errors/plan-not-found";

export class CreateContractUseCase {
  constructor(
    private contractRepository: ContractRepository,
    private studentRepository: StudentRepository,
    private planRepository: PlanRepository
  ) {}

  async execute(data: CreateContractData): Promise<ContractWithPlan> {
    // Validate student exists
    const student = await this.studentRepository.findById(data.studentId);
    if (!student) {
      throw new StudentNotFoundError();
    }

    // Validate plan exists
    const plan = await this.planRepository.findById(data.planId);
    if (!plan) {
      throw new PlanNotFound();
    }

    // Create contract
    return this.contractRepository.create(data);
  }
}
