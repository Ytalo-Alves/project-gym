import type { FastifyReply, FastifyRequest } from "fastify";
import { makeAuthenticateUserUseCase } from "../../factories/make-authenticate-user.usecase";
import { ZodError } from "zod";
import { authenticateUserSchema } from "../authenticate-user.schema";

export async function AuthenticateUserController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // Validate input
    const { email, password } = authenticateUserSchema.parse(request.body);

    const auth = makeAuthenticateUserUseCase();
    const token = await auth.execute({ email, password });

    return reply.status(200).send(token);
  } catch (error) {
    // Handle validation errors
    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: "Dados inválidos",
        errors: error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    // Handle authentication errors (don't expose if email or password is wrong)
    if (error instanceof Error && error.message === "Invalid credentials") {
      return reply.status(401).send({
        message: "Email ou senha inválidos",
      });
    }

    // Handle unexpected errors
    console.error("Authentication error:", error);
    return reply.status(500).send({
      message: "Erro interno do servidor",
    });
  }
}
