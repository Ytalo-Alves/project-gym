import { app } from "../../../http/server";
import { PrismaUserRepository } from "../../user/infra/prisma-user.repository";
import { AuthenticateUserUseCase } from "../app/authenticate-user.usecase";
import { BcryptHashComparer } from "../infra/bcrypt-hash-comparer";
import { FastifyJwtEncrypter } from "../infra/jwt-encrypter";

export function makeAuthenticateUserUseCase() {
  const userRepo = new PrismaUserRepository()
  const hash = new BcryptHashComparer()
  const jwt = new FastifyJwtEncrypter(app)

  return new AuthenticateUserUseCase(userRepo, hash, jwt)
}