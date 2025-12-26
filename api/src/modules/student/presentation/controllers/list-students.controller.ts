import { FastifyReply, FastifyRequest } from "fastify";
import { makeListStudentsUseCase } from "../../factories/make-list-students-usecase";

export class ListStudentsController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const listStudentsUseCase = makeListStudentsUseCase();
    const students = await listStudentsUseCase.execute();
    return reply.status(200).send(students);
  }
}
