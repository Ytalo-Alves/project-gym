import { prisma } from "../../../infra/prisma";
import {
  CreateStudentData,
  Student,
  UpdateStudentData,
} from "../domain/student.entity";
import { StudentRepository as IStudentRepository } from "../domain/student.repository";

export class PrismaStudentRepository implements IStudentRepository {
  async create(data: CreateStudentData): Promise<Student> {
    const student = await prisma.student.create({
      data: {
        ...data,
        gender: data.gender as any, // Prisma enum casting
      },
    });
    return student as unknown as Student;
  }

  async findAll(): Promise<Student[]> {
    const students = await prisma.student.findMany();
    return students as unknown as Student[];
  }

  async findById(id: string): Promise<Student | null> {
    const student = await prisma.student.findUnique({
      where: { id },
    });
    return student as unknown as Student | null;
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = await prisma.student.findUnique({
      where: { email },
    });
    return student as unknown as Student | null;
  }

  async findByCpf(cpf: string): Promise<Student | null> {
    const student = await prisma.student.findUnique({
      where: { cpf },
    });
    return student as unknown as Student | null;
  }

  async update(id: string, data: UpdateStudentData): Promise<Student> {
    const student = await prisma.student.update({
      where: { id },
      data: {
        ...data,
        gender: data.gender ? (data.gender as any) : undefined,
      },
    });
    return student as unknown as Student;
  }

  async delete(id: string): Promise<void> {
    await prisma.student.delete({
      where: { id },
    });
  }
}
