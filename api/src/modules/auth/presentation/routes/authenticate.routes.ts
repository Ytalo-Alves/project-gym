import type { FastifyInstance } from "fastify";
import { AuthenticateUserController } from "../controllers/authenticate-user.controller";


export async function authenticateRoutes(app: FastifyInstance) {
  app.post('/authenticate', AuthenticateUserController)
}