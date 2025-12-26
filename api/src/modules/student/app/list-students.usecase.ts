import { Student } from "../domain/student.entity";
import { StudentRepository } from "../domain/student.repository";

export class ListStudentsUseCase {
  constructor(private studentRepository: StudentRepository) {}

  async execute(): Promise<Student[]> {
    return this.studentRepository.findAll();
  }
}
