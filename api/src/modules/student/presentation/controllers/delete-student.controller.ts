import { FastifyReply, FastifyRequest } from "fastify";
import { studentIdSchema } from "../../student.schema";
import { makeDeleteStudentUseCase } from "../../factories/make-delete-student-usecase";

export class DeleteStudentController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = studentIdSchema.parse(request.params);
    const deleteStudentUseCase = makeDeleteStudentUseCase();
    await deleteStudentUseCase.execute(id);
    return reply.status(204).send();
  }
}
