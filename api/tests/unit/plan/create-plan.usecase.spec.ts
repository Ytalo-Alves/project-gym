import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryPlanRepository } from "../../../src/modules/plan/infra/in-memory/in-memory-plan.repository";
import { CreatePlanUseCase } from "../../../src/modules/plan/app/create-plan.usecase";

let planRepository: InMemoryPlanRepository;
let sut: CreatePlanUseCase;

describe("Create Plan Use Case - Unit Test", () => {
  beforeEach(() => {
    planRepository = new InMemoryPlanRepository();
    sut = new CreatePlanUseCase(planRepository);
  });

  it("should be able to create a new plan", async () => {
    const plan = await sut.execute({
      name: "Monthly Plan",
      duration: 1,
      price: 99.99,
      description: "Monthly gym membership",
    });

    expect(plan.id).toEqual(expect.any(String));
    expect(plan.name).toEqual("Monthly Plan");
    expect(plan.status).toEqual("ACTIVE");
  });

  it("should be able to create a plan with INACTIVE status", async () => {
    const plan = await sut.execute({
      name: "Yearly Plan",
      duration: 12,
      price: 999.99,
      status: "INACTIVE",
    });

    expect(plan.status).toEqual("INACTIVE");
  });
});
