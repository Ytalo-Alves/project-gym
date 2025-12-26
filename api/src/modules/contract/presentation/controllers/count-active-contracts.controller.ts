import { FastifyReply, FastifyRequest } from "fastify";
import { CountActiveContractsUseCase } from "../../app/count-active-contracts.usecase";

export class CountActiveContractsController {
  constructor(private countActiveContractsUseCase: CountActiveContractsUseCase) {}

  async handle(_request: FastifyRequest, reply: FastifyReply) {
    const count = await this.countActiveContractsUseCase.execute();
    return reply.status(200).send({ count });
  }
}

