import { DeleteStudentUseCase } from "../app/delete-student.usecase";
import { PrismaStudentRepository } from "../infra/prisma-student.repository";

export function makeDeleteStudentUseCase() {
  const studentRepository = new PrismaStudentRepository();
  const deleteStudentUseCase = new DeleteStudentUseCase(studentRepository);
  return deleteStudentUseCase;
}
