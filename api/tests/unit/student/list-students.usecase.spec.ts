import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryStudentRepository } from "../../../src/modules/student/infra/in-memory/in-memory-student.repository";
import { ListStudentsUseCase } from "../../../src/modules/student/app/list-students.usecase";

let studentRepository: InMemoryStudentRepository;
let sut: ListStudentsUseCase;

describe("List Students Use Case", () => {
  beforeEach(() => {
    studentRepository = new InMemoryStudentRepository();
    sut = new ListStudentsUseCase(studentRepository);
  });

  it("should be able to list all students", async () => {
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

    await studentRepository.create({
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

    const students = await sut.execute();

    expect(students).toHaveLength(2);
    expect(students[0].name).toEqual("John Doe");
    expect(students[1].name).toEqual("Jane Doe");
  });
});
