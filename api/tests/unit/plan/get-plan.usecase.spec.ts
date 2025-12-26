import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryPlanRepository } from "../../../src/modules/plan/infra/in-memory/in-memory-plan.repository";
import { GetPlanUseCase } from "../../../src/modules/plan/app/get-plan.usecase";

let planRepository: InMemoryPlanRepository;
let sut: GetPlanUseCase;

describe("Get Plan Use Case - Unit Test", () => {
  beforeEach(() => {
    planRepository = new InMemoryPlanRepository();
    sut = new GetPlanUseCase(planRepository);
  });

  it("should be able to get a plan by id", async () => {
    const createdPlan = await planRepository.create({
      name: "Monthly Plan",
      duration: 1,
      price: 99.99,
    });

    const plan = await sut.execute(createdPlan.id);

    expect(plan.id).toEqual(createdPlan.id);
    expect(plan.name).toEqual("Monthly Plan");
  });

  it("should not be able to get a non-existing plan", async () => {
    await expect(() => sut.execute("non-existing-id")).rejects.toBeInstanceOf(
      Error
    );
  });
});
