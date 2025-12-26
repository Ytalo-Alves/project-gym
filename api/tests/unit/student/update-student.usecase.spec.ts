import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryStudentRepository } from "../../../src/modules/student/infra/in-memory/in-memory-student.repository";
import { UpdateStudentUseCase } from "../../../src/modules/student/app/update-student.usecase";

let studentRepository: InMemoryStudentRepository;
let sut: UpdateStudentUseCase;

describe("Update Student Use Case", () => {
  beforeEach(() => {
    studentRepository = new InMemoryStudentRepository();
    sut = new UpdateStudentUseCase(studentRepository);
  });

  it("should be able to update a student", async () => {
    const createdStudent = await studentRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "123456789",
      cpf: "123.456.789-00",
      dateOfBirth: new Date("1990-01-01"),
      gender: "MALE",
      cep: "12345-678",
      address: "Main St",
      numberAddress: "123",
      neighborhood: "Downtown",
      city: "City",
      state: "State",
    });

    const updatedStudent = await sut.execute(createdStudent.id, {
      name: "John Doe Updated",
    });

    expect(updatedStudent.name).toEqual("John Doe Updated");
  });

  it("should not be able to update a non-existing student", async () => {
    await expect(() =>
      sut.execute("non-existing-id", {
        name: "John Doe Updated",
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should not be able to update email to one that is already in use", async () => {
    await studentRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "123456789",
      cpf: "123.456.789-00",
      dateOfBirth: new Date("1990-01-01"),
      gender: "MALE",
      cep: "12345-678",
      address: "Main St",
      numberAddress: "123",
      neighborhood: "Downtown",
      city: "City",
      state: "State",
    });

    const student2 = await studentRepository.create({
      name: "Jane Doe",
      email: "janedoe@example.com",
      phone: "987654321",
      cpf: "987.654.321-00",
      dateOfBirth: new Date("1995-01-01"),
      gender: "FEMALE",
      cep: "12345-678",
      address: "Main St",
      numberAddress: "123",
      neighborhood: "Downtown",
      city: "City",
      state: "State",
    });

    await expect(() =>
      sut.execute(student2.id, {
        email: "johndoe@example.com",
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
