import { FastifyRequest, FastifyReply } from "fastify";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
  } catch (err) {
    console.log("Auth Error:", err);
    console.log("Headers:", request.headers);
    return reply.status(401).send({ message: "Unauthorized" });
  }
}
