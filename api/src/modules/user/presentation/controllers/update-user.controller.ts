import type { FastifyReply, FastifyRequest } from "fastify";
import { updatedUserSchema } from "../../user.schema";
import { makeUpdateUserUseCase } from "../../factories/make-update-user-usecase";
import { UpdateUserResponseDTO } from "../dtos/update-user-response.dto";

export class UpdateUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = updatedUserSchema.parse(request.body);

    const updateUserUseCase = makeUpdateUserUseCase();
    const result = await updateUserUseCase.update(id, data);

    const response = new UpdateUserResponseDTO(result);

    return reply.status(200).send(response);
  }
}
