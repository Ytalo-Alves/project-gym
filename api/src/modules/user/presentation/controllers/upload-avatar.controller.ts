import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaUserRepository } from "../../infra/prisma-user.repository";
import { UploadAvatarUseCase } from "../../app/upload-avatar.usecase";

export class UploadAvatarController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ message: "No file uploaded" });
    }

    const userRepo = new PrismaUserRepository();
    const uploadAvatarUseCase = new UploadAvatarUseCase(userRepo);

    try {
      const { avatarUrl } = await uploadAvatarUseCase.execute({
        userId: request.user.sub,
        file: data,
      });

      return reply.status(200).send({ avatarUrl });
    } catch (err: any) {
      return reply.status(400).send({ message: err.message });
    }
  }
}
