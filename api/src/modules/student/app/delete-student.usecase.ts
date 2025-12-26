import { StudentRepository } from "../domain/student.repository";
import { StudentNotFoundError } from "../../../core/errors/student-not-found";

export class DeleteStudentUseCase {
  constructor(private studentRepository: StudentRepository) {}

  async execute(id: string): Promise<void> {
    const student = await this.studentRepository.findById(id);
    if (!student) {
      throw new StudentNotFoundError();
    }

    await this.studentRepository.delete(id);
  }
}
