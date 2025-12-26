import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaStudentRepository } from "../../infra/prisma-student.repository";
import { UploadStudentPhotoUseCase } from "../../app/upload-student-photo.usecase";

interface RouteParams {
  id: string;
}

export class UploadStudentPhotoController {
  async handle(
    request: FastifyRequest<{ Params: RouteParams }>,
    reply: FastifyReply
  ) {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ message: "No file uploaded" });
    }

    const studentRepo = new PrismaStudentRepository();
    const uploadStudentPhotoUseCase = new UploadStudentPhotoUseCase(
      studentRepo
    );

    try {
      const { photoUrl } = await uploadStudentPhotoUseCase.execute({
        studentId: request.params.id,
        file: data,
      });

      return reply.status(200).send({ photoUrl });
    } catch (err: any) {
      return reply.status(400).send({ message: err.message });
    }
  }
}
