import { FastifyReply, FastifyRequest } from "fastify";
import { planIdSchema } from "../../plan.schema";
import { makeDeletePlanUseCase } from "../../factories/make-delete-plan-usecase";

export class DeletePlanController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = planIdSchema.parse(request.params);
      const deletePlanUseCase = makeDeletePlanUseCase();
      await deletePlanUseCase.execute(id);
      return reply.status(204).send();
    } catch (error) {
      // Re-lançar o erro para que o ErrorHandler global o trate
      throw error;
    }
  }
}
