import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryPlanRepository } from "../../../src/modules/plan/infra/in-memory/in-memory-plan.repository";
import { UpdatePlanUseCase } from "../../../src/modules/plan/app/update-plan.usecase";

let planRepository: InMemoryPlanRepository;
let sut: UpdatePlanUseCase;

describe("Update Plan Use Case - Unit Test", () => {
  beforeEach(() => {
    planRepository = new InMemoryPlanRepository();
    sut = new UpdatePlanUseCase(planRepository);
  });

  it("should be able to update a plan", async () => {
    const createdPlan = await planRepository.create({
      name: "Monthly Plan",
      duration: 1,
      price: 99.99,
    });

    const updatedPlan = await sut.execute(createdPlan.id, {
      name: "Monthly Plan Updated",
      price: 89.99,
    });

    expect(updatedPlan.name).toEqual("Monthly Plan Updated");
    expect(updatedPlan.price).toEqual(89.99);
  });

  it("should not be able to update a non-existing plan", async () => {
    await expect(() =>
      sut.execute("non-existing-id", {
        name: "Plan Updated",
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be able to update plan status", async () => {
    const createdPlan = await planRepository.create({
      name: "Monthly Plan",
      duration: 1,
      price: 99.99,
    });

    const updatedPlan = await sut.execute(createdPlan.id, {
      status: "INACTIVE",
    });

    expect(updatedPlan.status).toEqual("INACTIVE");
  });
});
