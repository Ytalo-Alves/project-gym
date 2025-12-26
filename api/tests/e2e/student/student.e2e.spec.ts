import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../../src/http/server";
import request from "supertest";
import { prisma } from "../../../src/infra/prisma";

describe("Student - e2e Test", () => {
  let token: string;

  beforeAll(async () => {
    await app.ready();
    await prisma.user.deleteMany();
    await prisma.student.deleteMany();

    // Cria usuário admin e autentica para obter token
    const adminEmail = "admin-student@example.com";
    const adminPassword = "123456";

    await request(app.server).post("/create-user").send({
      name: "Admin Student",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });

    const authResponse = await request(app.server).post("/authenticate").send({
      email: adminEmail,
      password: adminPassword,
    });

    token = authResponse.body.token;
  });

  afterAll(async () => {
    await prisma.student.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  it("Should be able to create a student", async () => {
    const response = await request(app.server)
      .post("/students")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "123456789",
        cpf: "123.456.789-00",
        dateOfBirth: "1990-01-01",
        gender: "MALE",
        cep: "12345-678",
        address: "Main St",
        numberAddress: "123",
        neighborhood: "Downtown",
        city: "City",
        state: "State",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("Should be able to list students", async () => {
    const response = await request(app.server)
      .get("/students")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toEqual("John Doe");
  });

  it("Should be able to get a student by id", async () => {
    const listResponse = await request(app.server)
      .get("/students")
      .set("Authorization", `Bearer ${token}`);
    const studentId = listResponse.body[0].id;

    const response = await request(app.server)
      .get(`/students/${studentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toEqual(studentId);
  });

  it("Should be able to update a student", async () => {
    const listResponse = await request(app.server)
      .get("/students")
      .set("Authorization", `Bearer ${token}`);
    const studentId = listResponse.body[0].id;

    const response = await request(app.server)
      .put(`/students/${studentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "John Doe Updated",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toEqual("John Doe Updated");
  });

  it("Should be able to delete a student", async () => {
    const listResponse = await request(app.server)
      .get("/students")
      .set("Authorization", `Bearer ${token}`);
    const studentId = listResponse.body[0].id;

    const response = await request(app.server)
      .delete(`/students/${studentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(204);

    const getResponse = await request(app.server)
      .get(`/students/${studentId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(getResponse.statusCode).toBe(404);
  });
});
