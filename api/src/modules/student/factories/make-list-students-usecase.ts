import { ListStudentsUseCase } from "../app/list-students.usecase";
import { PrismaStudentRepository } from "../infra/prisma-student.repository";

export function makeListStudentsUseCase() {
  const studentRepository = new PrismaStudentRepository();
  const listStudentsUseCase = new ListStudentsUseCase(studentRepository);
  return listStudentsUseCase;
}
