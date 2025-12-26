import { FastifyRequest, FastifyReply } from "fastify";
import { CreateContractUseCase } from "../../app/create-contract.usecase";
import { createContractSchema } from "../../contract.schema";
import { StudentNotFoundError } from "../../../../core/errors/student-not-found";
import { PlanNotFound } from "../../../../core/errors/plan-not-found";
import { ZodError } from "zod";

export class CreateContractController {
  constructor(private createContractUseCase: CreateContractUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = createContractSchema.parse(request.body);

      const contract = await this.createContractUseCase.execute({
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
      });

      return reply.status(201).send(contract);
    } catch (error) {
      if (error instanceof StudentNotFoundError) {
        return reply.status(404).send({ message: error.message });
      }

      if (error instanceof PlanNotFound) {
        return reply.status(404).send({ message: error.message });
      }

      if (error instanceof ZodError) {
        return reply
          .status(400)
          .send({ message: "Dados inválidos", errors: error.issues });
      }

      throw error;
    }
  }
}
