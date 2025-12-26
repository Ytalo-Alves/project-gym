import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryStudentRepository } from "../../../src/modules/student/infra/in-memory/in-memory-student.repository";
import { GetStudentUseCase } from "../../../src/modules/student/app/get-student.usecase";

let studentRepository: InMemoryStudentRepository;
let sut: GetStudentUseCase;

describe("Get Student Use Case - Unit Test", () => {
  beforeEach(() => {
    studentRepository = new InMemoryStudentRepository();
    sut = new GetStudentUseCase(studentRepository);
  });

  it("should be able to get a student by id", async () => {
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

    const student = await sut.execute(createdStudent.id);

    expect(student.id).toEqual(createdStudent.id);
    expect(student.name).toEqual("John Doe");
  });

  it("should not be able to get a non-existing student", async () => {
    await expect(() => sut.execute("non-existing-id")).rejects.toBeInstanceOf(
      Error
    );
  });
});
