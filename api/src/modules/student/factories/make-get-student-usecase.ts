import { GetStudentUseCase } from "../app/get-student.usecase";
import { PrismaStudentRepository } from "../infra/prisma-student.repository";

export function makeGetStudentUseCase() {
  const studentRepository = new PrismaStudentRepository();
  const getStudentUseCase = new GetStudentUseCase(studentRepository);
  return getStudentUseCase;
}
