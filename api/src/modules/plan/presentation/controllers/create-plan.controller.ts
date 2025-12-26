import { FastifyReply, FastifyRequest } from "fastify";
import { createPlanSchema } from "../../plan.schema";
import { makeCreatePlanUseCase } from "../../factories/make-create-plan-usecase";

export class CreatePlanController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const data = createPlanSchema.parse(request.body);
    const createPlanUseCase = makeCreatePlanUseCase();
    const plan = await createPlanUseCase.execute(data);
    return reply.status(201).send(plan);
  }
}
