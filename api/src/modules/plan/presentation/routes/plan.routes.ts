import { FastifyInstance } from "fastify";
import { CreatePlanController } from "../controllers/create-plan.controller";
import { ListPlansController } from "../controllers/list-plans.controller";
import { GetPlanController } from "../controllers/get-plan.controller";
import { UpdatePlanController } from "../controllers/update-plan.controller";
import { DeletePlanController } from "../controllers/delete-plan.controller";
import { authenticate } from "../../../../http/middleware/authenticate";

export async function planRoutes(app: FastifyInstance) {
  app.post("/", { onRequest: [authenticate] }, new CreatePlanController().handle);
  app.get("/", { onRequest: [authenticate] }, new ListPlansController().handle);
  app.get("/:id", { onRequest: [authenticate] }, new GetPlanController().handle);
  app.put("/:id", { onRequest: [authenticate] }, new UpdatePlanController().handle);
  app.delete("/:id", { onRequest: [authenticate] }, new DeletePlanController().handle);
}
