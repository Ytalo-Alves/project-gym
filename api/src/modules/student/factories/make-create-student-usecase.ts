import { CreateStudentUseCase } from "../app/create-student.usecase";
import { PrismaStudentRepository } from "../infra/prisma-student.repository";

export function makeCreateStudentUseCase() {
  const studentRepository = new PrismaStudentRepository();
  const createStudentUseCase = new CreateStudentUseCase(studentRepository);
  return createStudentUseCase;
}
