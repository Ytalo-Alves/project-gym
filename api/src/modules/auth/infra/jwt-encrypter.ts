import { FastifyInstance } from "fastify";
import { Encrypter } from "./encrypter";

export class FastifyJwtEncrypter implements Encrypter {
  constructor(private readonly app: FastifyInstance) {}

  async encrypt(payload: {
    sub: string;
    role: string;
    name?: string;
    email?: string;
    avatarUrl?: string;
  }): Promise<string> {
    return this.app.jwt.sign(payload);
  }
}
