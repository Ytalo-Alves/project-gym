import { FastifyReply, FastifyRequest } from "fastify";
import { makeListPlansUseCase } from "../../factories/make-list-plans-usecase";

export class ListPlansController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const listPlansUseCase = makeListPlansUseCase();
    const plans = await listPlansUseCase.execute();
    return reply.status(200).send(plans);
  }
}
