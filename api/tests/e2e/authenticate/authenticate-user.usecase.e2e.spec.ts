import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { prisma } from "../../../src/infra/prisma";
import { app } from "../../../src/http/server";

describe("Authenticate User - e2e Test", async () => {
  beforeAll(async () => {
    await app.ready();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });

  it("Should be able authenticate a user and return valid token", async () => {
    await request(app.server)
      .post("/create-user")
      .send({
        name: "user auh",
        email: "userauth@email.com",
        password: "123456",
        role: "admin",
      })
      .expect(201);

    const response = await request(app.server)
      .post("/authenticate")
      .send({
        email: "userauth@email.com",
        password: "123456",
      })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      })
    );
  });

  it("Should not be able to authenticate with invalid credentials", async () => {
    const response = await request(app.server)
      .post("/authenticate")
      .send({
        email: "userauth@email.com",
        password: "wrong-password",
      })
      .expect(401);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Email ou senha inválidos",
      })
    );
  });
});
