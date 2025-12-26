import type { FastifyInstance } from "fastify";
import { CreateUserController } from "../controllers/create-user.controller";
import { UpdateUserController } from "../controllers/update-user.controller";
import { ChangePasswordController } from "../controllers/change-password.controller";
import { authenticate } from "../../../../http/middleware/authenticate";

import { UploadAvatarController } from "../controllers/upload-avatar.controller";

export async function userRoutes(app: FastifyInstance) {
  const createUserController = new CreateUserController();
  const updateUserController = new UpdateUserController();
  const changePasswordController = new ChangePasswordController();
  const uploadAvatarController = new UploadAvatarController();

  app.post("/create-user", (request, reply) =>
    createUserController.handle(request, reply)
  );

  app.put(
    "/update-user/:id",
    { onRequest: [authenticate] },
    (request, reply) => updateUserController.handle(request, reply)
  );

  app.patch(
    "/change-password",
    { onRequest: [authenticate] },
    (request, reply) => changePasswordController.handle(request, reply)
  );

  app.patch("/users/avatar", { onRequest: [authenticate] }, (request, reply) =>
    uploadAvatarController.handle(request, reply)
  );
}
