import { CreateStudentData, Student } from "../domain/student.entity";
import { StudentRepository } from "../domain/student.repository";
import { StudentEmailAlreadyExistsError } from "../../../core/errors/student-email-already-exists";
import { StudentCpfAlreadyExistsError } from "../../../core/errors/student-cpf-already-exists";

export class CreateStudentUseCase {
  constructor(private studentRepository: StudentRepository) {}

  async execute(data: CreateStudentData): Promise<Student> {
    const studentAlreadyExists = await this.studentRepository.findByEmail(
      data.email
    );
    if (studentAlreadyExists) {
      throw new StudentEmailAlreadyExistsError();
    }

    const cpfAlreadyExists = await this.studentRepository.findByCpf(data.cpf);
    if (cpfAlreadyExists) {
      throw new StudentCpfAlreadyExistsError();
    }

    return this.studentRepository.create(data);
  }
}
