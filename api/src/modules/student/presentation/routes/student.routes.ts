import { FastifyInstance, FastifyRequest } from "fastify";
import { CreateStudentController } from "../controllers/create-student.controller";
import { ListStudentsController } from "../controllers/list-students.controller";
import { GetStudentController } from "../controllers/get-student.controller";
import { UpdateStudentController } from "../controllers/update-student.controller";
import { DeleteStudentController } from "../controllers/delete-student.controller";
import { UploadStudentPhotoController } from "../controllers/upload-student-photo.controller";
import { authenticate } from "../../../../http/middleware/authenticate";

export async function studentRoutes(app: FastifyInstance) {
  app.post("/", { onRequest: [authenticate] }, new CreateStudentController().handle);
  app.get("/", { onRequest: [authenticate] }, new ListStudentsController().handle);
  app.get("/:id", { onRequest: [authenticate] }, new GetStudentController().handle);
  app.put("/:id", { onRequest: [authenticate] }, new UpdateStudentController().handle);
  app.delete("/:id", { onRequest: [authenticate] }, new DeleteStudentController().handle);
  app.patch("/:id/photo", { onRequest: [authenticate] }, (request, reply) =>
    new UploadStudentPhotoController().handle(
      request as FastifyRequest<{ Params: { id: string } }>,
      reply
    )
  );
}
