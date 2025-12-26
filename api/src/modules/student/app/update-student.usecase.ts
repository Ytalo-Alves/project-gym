import { Student, UpdateStudentData } from "../domain/student.entity";
import { StudentRepository } from "../domain/student.repository";
import { StudentNotFoundError } from "../../../core/errors/student-not-found";
import { StudentEmailAlreadyExistsError } from "../../../core/errors/student-email-already-exists";
import { StudentCpfAlreadyExistsError } from "../../../core/errors/student-cpf-already-exists";

export class UpdateStudentUseCase {
  constructor(private studentRepository: StudentRepository) {}

  async execute(id: string, data: UpdateStudentData): Promise<Student> {
    const student = await this.studentRepository.findById(id);
    if (!student) {
      throw new StudentNotFoundError();
    }

    if (data.email) {
      const emailAlreadyExists = await this.studentRepository.findByEmail(
        data.email
      );
      if (emailAlreadyExists && emailAlreadyExists.id !== id) {
        throw new StudentEmailAlreadyExistsError();
      }
    }

    if (data.cpf) {
      const cpfAlreadyExists = await this.studentRepository.findByCpf(data.cpf);
      if (cpfAlreadyExists && cpfAlreadyExists.id !== id) {
        throw new StudentCpfAlreadyExistsError();
      }
    }

    return this.studentRepository.update(id, data);
  }
}
