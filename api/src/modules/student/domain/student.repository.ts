import {
  Student,
  CreateStudentData,
  UpdateStudentData,
} from "./student.entity";

export interface StudentRepository {
  create(data: CreateStudentData): Promise<Student>;
  findAll(): Promise<Student[]>;
  findById(id: string): Promise<Student | null>;
  findByEmail(email: string): Promise<Student | null>;
  findByCpf(cpf: string): Promise<Student | null>;
  update(id: string, data: UpdateStudentData): Promise<Student>;
  delete(id: string): Promise<void>;
}
