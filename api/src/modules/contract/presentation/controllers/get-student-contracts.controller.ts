import { FastifyRequest, FastifyReply } from "fastify";
import { GetStudentContractsUseCase } from "../../app/get-student-contracts.usecase";
import { z } from "zod";

const paramsSchema = z.object({
  studentId: z.string().uuid(),
});

export class GetStudentContractsController {
  constructor(private getStudentContractsUseCase: GetStudentContractsUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { studentId } = paramsSchema.parse(request.params);

    const contracts = await this.getStudentContractsUseCase.execute(studentId);

    return reply.status(200).send(contracts);
  }
}
