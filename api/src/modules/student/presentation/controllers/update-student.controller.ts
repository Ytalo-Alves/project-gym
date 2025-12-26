import { FastifyReply, FastifyRequest } from "fastify";
import { studentIdSchema, updateStudentSchema } from "../../student.schema";
import { makeUpdateStudentUseCase } from "../../factories/make-update-student-usecase";

export class UpdateStudentController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = studentIdSchema.parse(request.params);
    const data = updateStudentSchema.parse(request.body);
    const updateStudentUseCase = makeUpdateStudentUseCase();
    const student = await updateStudentUseCase.execute(id, data);
    return reply.status(200).send(student);
  }
}
