import { ChangePasswordUseCase } from "../app/change-password.usecase";
import { PrismaUserRepository } from "../infra/prisma-user.repository";

export function makeChangePasswordUseCase() {
  const userRepository = new PrismaUserRepository();
  return new ChangePasswordUseCase(userRepository);
}
