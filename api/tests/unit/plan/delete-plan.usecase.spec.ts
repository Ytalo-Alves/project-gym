import { describe, expect, it, beforeEach, vi } from "vitest";
import { InMemoryPlanRepository } from "../../../src/modules/plan/infra/in-memory/in-memory-plan.repository";
import { DeletePlanUseCase } from "../../../src/modules/plan/app/delete-plan.usecase";
import { ContractRepository } from "../../../src/modules/contract/domain/contract.repository";

let planRepository: InMemoryPlanRepository;
let contractRepository: ContractRepository;
let sut: DeletePlanUseCase;

describe("Delete Plan Use Case - Unit Test", () => {
  beforeEach(() => {
    planRepository = new InMemoryPlanRepository();

    // Mock simples do ContractRepository
    contractRepository = {
      create: vi.fn(),
      findByStudentId: vi.fn(),
      findActiveByStudentId: vi.fn(),
      countByPlanId: vi.fn().mockResolvedValue(0), // Default: sem contratos
    };

    sut = new DeletePlanUseCase(planRepository, contractRepository);
  });

  it("should be able to delete a plan", async () => {
    const createdPlan = await planRepository.create({
      name: "Monthly Plan",
      duration: 1,
      price: 99.99,
    });

    await sut.execute(createdPlan.id);

    const plan = await planRepository.findById(createdPlan.id);
    expect(plan).toBeNull();
  });

  it("should not be able to delete a non-existing plan", async () => {
    await expect(() => sut.execute("non-existing-id")).rejects.toBeInstanceOf(
      Error
    );
  });

  it("should not be able to delete a plan with linked contracts", async () => {
    const createdPlan = await planRepository.create({
      name: "Monthly Plan",
      duration: 1,
      price: 99.99,
    });

    // Mock para retornar 1 contrato vinculado
    contractRepository.countByPlanId = vi.fn().mockResolvedValue(1);

    await expect(() => sut.execute(createdPlan.id)).rejects.toThrow();
  });
});
