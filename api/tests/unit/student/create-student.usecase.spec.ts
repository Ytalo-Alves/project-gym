import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryStudentRepository } from "../../../src/modules/student/infra/in-memory/in-memory-student.repository";
import { CreateStudentUseCase } from "../../../src/modules/student/app/create-student.usecase";

let studentRepository: InMemoryStudentRepository;
let sut: CreateStudentUseCase;

describe("Create Student Use Case - Unit Test", () => {
  beforeEach(() => {
    studentRepository = new InMemoryStudentRepository();
    sut = new CreateStudentUseCase(studentRepository);
  });

  it("should be able to create a new student", async () => {
    const student = await sut.execute({
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

    expect(student.id).toEqual(expect.any(String));
    expect(student.name).toEqual("John Doe");
  });

  it("should not be able to create a student with same email", async () => {
    await sut.execute({
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

    await expect(() =>
      sut.execute({
        name: "John Doe 2",
        email: "johndoe@example.com",
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
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should not be able to create a student with same CPF", async () => {
    await sut.execute({
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

    await expect(() =>
      sut.execute({
        name: "John Doe 2",
        email: "johndoe2@example.com",
        phone: "987654321",
        cpf: "123.456.789-00",
        dateOfBirth: new Date("1995-01-01"),
        gender: "FEMALE",
        cep: "12345-678",
        address: "Main St",
        numberAddress: "123",
        neighborhood: "Downtown",
        city: "City",
        state: "State",
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
