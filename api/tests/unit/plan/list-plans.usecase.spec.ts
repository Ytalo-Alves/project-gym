import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryPlanRepository } from "../../../src/modules/plan/infra/in-memory/in-memory-plan.repository";
import { ListPlansUseCase } from "../../../src/modules/plan/app/list-plans.usecase";

let planRepository: InMemoryPlanRepository;
let sut: ListPlansUseCase;

describe("List Plans Use Case - Unit Test", () => {
  beforeEach(() => {
    planRepository = new InMemoryPlanRepository();
    sut = new ListPlansUseCase(planRepository);
  });

  it("should be able to list all plans", async () => {
    await planRepository.create({
      name: "Monthly Plan",
      duration: 1,
      price: 99.99,
    });

    await planRepository.create({
      name: "Yearly Plan",
      duration: 12,
      price: 999.99,
    });

    const plans = await sut.execute();

    expect(plans).toHaveLength(2);
    expect(plans[0].name).toEqual("Monthly Plan");
    expect(plans[1].name).toEqual("Yearly Plan");
  });
});
