import { FastifyReply, FastifyRequest } from "fastify";
import { studentIdSchema } from "../../student.schema";
import { makeGetStudentUseCase } from "../../factories/make-get-student-usecase";

export class GetStudentController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = studentIdSchema.parse(request.params);
    const getStudentUseCase = makeGetStudentUseCase();
    const student = await getStudentUseCase.execute(id);
    return reply.status(200).send(student);
  }
}
