import { FastifyReply, FastifyRequest } from "fastify";
import { planIdSchema } from "../../plan.schema";
import { makeGetPlanUseCase } from "../../factories/make-get-plan-usecase";

export class GetPlanController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = planIdSchema.parse(request.params);
    const getPlanUseCase = makeGetPlanUseCase();
    const plan = await getPlanUseCase.execute(id);
    return reply.status(200).send(plan);
  }
}
