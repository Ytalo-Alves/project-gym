import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { sub: string; role: string }; // o que recebe ao criar o token
    user: { sub: string; role: string };    // o que teremos no request.user
  }
}
