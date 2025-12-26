import {
  CreateStudentData,
  Student,
  UpdateStudentData,
} from "../../domain/student.entity";
import { StudentRepository as IStudentRepository } from "../../domain/student.repository";
import { randomUUID } from "node:crypto";

export class InMemoryStudentRepository implements IStudentRepository {
  public items: Student[] = [];

  async create(data: CreateStudentData): Promise<Student> {
    const student: Student = {
      id: randomUUID(),
      ...data,
      emergencyContact: data.emergencyContact ?? null,
      emergencyContactPhone: data.emergencyContactPhone ?? null,
      observation: data.observation ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.push(student);
    return student;
  }

  async findAll(): Promise<Student[]> {
    return this.items;
  }

  async findById(id: string): Promise<Student | null> {
    const student = this.items.find((item) => item.id === id);
    return student || null;
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = this.items.find((item) => item.email === email);
    return student || null;
  }

  async findByCpf(cpf: string): Promise<Student | null> {
    const student = this.items.find((item) => item.cpf === cpf);
    return student || null;
  }

  async update(id: string, data: UpdateStudentData): Promise<Student> {
    const studentIndex = this.items.findIndex((item) => item.id === id);

    if (studentIndex === -1) {
      throw new Error("Student not found");
    }

    const student = this.items[studentIndex];

    const updatedStudent: Student = {
      ...student,
      ...data,
      updatedAt: new Date(),
    };

    this.items[studentIndex] = updatedStudent;

    return updatedStudent;
  }

  async delete(id: string): Promise<void> {
    const studentIndex = this.items.findIndex((item) => item.id === id);

    if (studentIndex !== -1) {
      this.items.splice(studentIndex, 1);
    }
  }
}
