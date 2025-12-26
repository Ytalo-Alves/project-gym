import { FastifyReply, FastifyRequest } from "fastify";
import { planIdSchema, updatePlanSchema } from "../../plan.schema";
import { makeUpdatePlanUseCase } from "../../factories/make-update-plan-usecase";

export class UpdatePlanController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = planIdSchema.parse(request.params);
    const data = updatePlanSchema.parse(request.body);
    const updatePlanUseCase = makeUpdatePlanUseCase();
    const plan = await updatePlanUseCase.execute(id, data);
    return reply.status(200).send(plan);
  }
}
