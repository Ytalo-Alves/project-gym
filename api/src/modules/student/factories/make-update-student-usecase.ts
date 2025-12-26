import { UpdateStudentUseCase } from "../app/update-student.usecase";
import { PrismaStudentRepository } from "../infra/prisma-student.repository";

export function makeUpdateStudentUseCase() {
  const studentRepository = new PrismaStudentRepository();
  const updateStudentUseCase = new UpdateStudentUseCase(studentRepository);
  return updateStudentUseCase;
}
