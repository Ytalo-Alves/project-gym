import { Student } from "../domain/student.entity";
import { StudentRepository } from "../domain/student.repository";
import { StudentNotFoundError } from "../../../core/errors/student-not-found";

export class GetStudentUseCase {
  constructor(private studentRepository: StudentRepository) {}

  async execute(id: string): Promise<Student> {
    const student = await this.studentRepository.findById(id);
    if (!student) {
      throw new StudentNotFoundError();
    }
    return student;
  }
}
