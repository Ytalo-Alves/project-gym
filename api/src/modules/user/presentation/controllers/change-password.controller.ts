import type { FastifyReply, FastifyRequest } from "fastify";
import { changePasswordSchema } from "../../user.schema";

import { UserNotFound } from "../../../../core/errors/user-not-found";
import { makeChangePasswordUseCase } from "../../factories/make-change-password-usecase";
import { InvalidCredentialsError } from "../../../../core/errors/invalid-credentials-error";

export class ChangePasswordController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Get user ID from auth middleware (JWT)
      const userId = request.user?.sub;

      if (!userId) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      const data = changePasswordSchema.parse(request.body);

      const changePasswordUseCase = makeChangePasswordUseCase();
      const result = await changePasswordUseCase.execute({
        userId,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      return reply.status(200).send(result);
    } catch (err) {
      if (err instanceof InvalidCredentialsError) {
        return reply
          .status(401)
          .send({ error: "Current password is incorrect" });
      }

      if (err instanceof UserNotFound) {
        return reply.status(404).send({ error: "User not found" });
      }

      throw err;
    }
  }
}
