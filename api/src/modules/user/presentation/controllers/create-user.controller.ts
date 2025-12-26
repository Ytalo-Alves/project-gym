import type { FastifyReply, FastifyRequest } from "fastify";
import { createUserSchema } from "../../user.schema";
import { makeCreateUserUseCase } from "../../factories/make-create-user-usecase";
import { CreateUserResponseDTO } from "../dtos/create-user-response.dto";

export class CreateUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const data = createUserSchema.parse(request.body);

    const createUserUseCase = makeCreateUserUseCase();
    const result = await createUserUseCase.create(data);

    const response = new CreateUserResponseDTO(result);

    return reply.status(201).send(response);
  }
}
