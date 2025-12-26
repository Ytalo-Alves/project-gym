import { FastifyReply, FastifyRequest } from "fastify";
import { createStudentSchema } from "../../student.schema";
import { makeCreateStudentUseCase } from "../../factories/make-create-student-usecase";

export class CreateStudentController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const data = createStudentSchema.parse(request.body);
    const createStudentUseCase = makeCreateStudentUseCase();
    const student = await createStudentUseCase.execute(data);
    return reply.status(201).send(student);
  }
}
