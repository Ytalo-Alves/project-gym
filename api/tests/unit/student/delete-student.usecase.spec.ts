import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryStudentRepository } from "../../../src/modules/student/infra/in-memory/in-memory-student.repository";
import { DeleteStudentUseCase } from "../../../src/modules/student/app/delete-student.usecase";

let studentRepository: InMemoryStudentRepository;
let sut: DeleteStudentUseCase;

describe("Delete Student Use Case - Unit Test", () => {
  beforeEach(() => {
    studentRepository = new InMemoryStudentRepository();
    sut = new DeleteStudentUseCase(studentRepository);
  });

  it("should be able to delete a student", async () => {
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

    await sut.execute(createdStudent.id);

    const student = await studentRepository.findById(createdStudent.id);
    expect(student).toBeNull();
  });

  it("should not be able to delete a non-existing student", async () => {
    await expect(() => sut.execute("non-existing-id")).rejects.toBeInstanceOf(
      Error
    );
  });
});
