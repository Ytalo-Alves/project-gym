import { UpdateUserUseCase } from "../app/update-user.usecase";
import { PrismaUserRepository } from "../infra/prisma-user.repository";

export function makeUpdateUserUseCase() {
  const userRepository = new PrismaUserRepository();
  return new UpdateUserUseCase(userRepository);
}
